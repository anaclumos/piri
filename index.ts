import { readdir, readFile, writeFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import { resolve, join, dirname, relative } from 'path'
import { createHash } from 'crypto'
import Bun from 'bun'
import { LANGUAGES } from './lang'
import { CONTENTS } from './content'
import OpenAI from 'openai'
import type { Content } from './content'
import type { Language } from './lang'
import pLimit from 'p-limit'
import Bottleneck from 'bottleneck'
import frontMatter from 'front-matter'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
})

// Initialize rate limiter
const limiter = new Bottleneck({
  minTime: 100, // Ensures 10 requests per second
  maxConcurrent: 1,
})

// Ensure target directories exist
const ensureDirectoryExistence = async (filePath: string) => {
  const dir = dirname(filePath)
  try {
    await mkdir(dir, { recursive: true })
  } catch (err: any) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
}

// Calculate hash of a file's content
const calculateHash = (content: string): string => {
  return createHash('sha256').update(content).digest('hex')
}

// Read .meta.json file and return its content as a JSON object
const readMetaFile = async (filePath: string) => {
  try {
    const content = await readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    // If file doesn't exist or there's an error reading/parsing, return null
    return null
  }
}

type Message = { role: 'system' | 'user' | 'assistant'; content: string }

// Translate text using OpenAI API
const translateText = async (
  text: string,
  language: Language,
  previousMessages: Message[] = []
): Promise<string> => {
  if (text.split(' ').length === 1) {
    return text
  }

  await new Promise((resolve) => setTimeout(resolve, 100))

  const systemPrompt = `You are a helpful translator that translates technical texts. Remember the following instructions:
  
  - Do not translate code blocks or text inside <angle brackets>. However, if JSX Objects have an English description or string inside, only translate the English text.
  - Do not translate JSX comments (e.g., {/* comment */}).
  - Do not translate proper nouns, brand names, or tech jargon including but not limited to 'Server Components', 'React', or 'React Native', 'React Hooks', 'Next.js', 'Gatsby', or 'Expo'; keep the original jargon in those cases. Do not modify any example codes given, except for the comments.
  
  For example,
  
  - If the provided text is <BlogCard title="React Labs: What We've Been Working On – June 2022" date="June 15, 2022" url="/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022"> and we are translating it to 한국어 (ko), the translated text should be <BlogCard title="React 랩스: 우리가 하고 있던 일 – 2022년 6월" date="2022년 6월 15일" url="/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022">.
  - If the provided text is 'React Native' and we are translating it to Español (es), it should be 'React Native' because it's a proper noun.
  - If the provided text is '<Intro>' and we are translating it to Español (es), it should be '<Intro>' because it's inside <angle brackets> and it doesn't have an English string inside.
  - If the provided text is 'React Versions' and we are translating it to 한국어 (ko), it should be 'React 버전'.
  - If the provided text is 'React Versions' and we are translating it to 日本語 (ja), it should be 'React バージョン'.
  
  Translate the following text to ${language.name} (${language.code}). Do not respond. Start the translation immediately:`
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
      ...previousMessages,
    ],
    temperature: 0,
  })

  if (!response || !response.choices || !response.choices[0]) {
    console.error('No response from OpenAI API')
    return translateText(text, language, previousMessages)
  }

  if (response.choices[0].finish_reason === 'length') {
    console.log('Response was too long, trying again...')

    return await translateText(text, language, [
      ...previousMessages,
      {
        role: 'assistant',
        content: response.choices[0].message.content ?? '',
      },
    ])
  }
  return (
    previousMessages.map((message) => message.content).join('\n') +
      response.choices[0].message.content ?? ''
  )
}

// Extract and translate frontmatter values
const translateFrontmatter = async (frontmatter: any, language: Language) => {
  const translatedFrontmatter: any = {}
  for (const [key, value] of Object.entries(frontmatter)) {
    if (key === 'title' || key === 'description') {
      translatedFrontmatter[key] = await translateText(value as string, language)
    } else {
      translatedFrontmatter[key] = value
    }
  }
  return translatedFrontmatter
}

// Handle translation of markdown files, skipping code blocks
const translateMarkdownFile = async (inputContent: string, language: Language) => {
  // Preprocess content to remove inline JS comments

  const parsed = frontMatter(inputContent)
  const frontmatter = await translateFrontmatter(parsed.attributes, language)

  const translatedContent = await translateText(parsed.body, language)

  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  if (parsed.frontmatter) {
    return `---\n${frontmatterString}\n---\n\n${translatedContent}`
  }

  return translatedContent
}

// Copy .md files and create corresponding .meta.json files if needed
const copyFilesForLanguage = async ({
  content,
  language,
}: {
  content: Content
  language: Language
}) => {
  const sourcePath = resolve(content.source)
  const targetPath = content.target.replace('LANG', language.code)

  const files = await readdir(sourcePath, { recursive: true })
  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const relativePath = relative(sourcePath, join(sourcePath, file))
      const destination = join(targetPath, relativePath)
      const metaDestination = `${destination}.meta.json`

      const inputFile = Bun.file(join(sourcePath, file))
      const inputContent = await inputFile.text()
      const sourceHash = calculateHash(inputContent)

      let metaContent = await readMetaFile(metaDestination)

      if (!metaContent || metaContent.hash !== sourceHash) {
        await ensureDirectoryExistence(destination)

        await Bun.write(destination, inputContent)
        const newMetaContent = {
          hash: sourceHash,
          translated: false,
        }
        await Bun.write(metaDestination, JSON.stringify(newMetaContent, null, 2))

        console.log(`Copied ${file} to ${destination}`)
        console.log(`Updated meta for ${file} at ${metaDestination}`)
      } else {
        console.log(`Skipped ${file} as the hash matches`)
      }
    }
  }
}

// Translate .md files if needed
const translateFilesForLanguage = async ({
  content,
  language,
}: {
  content: Content
  language: Language
}) => {
  const targetPath = content.target.replace('LANG', language.code)

  const files = await readdir(targetPath, { recursive: true })
  const limit = pLimit(4)

  await Promise.all(
    files.map((file) =>
      limit(async () => {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const destination = join(targetPath, file)
          const metaDestination = `${destination}.meta.json`

          let metaContent = await readMetaFile(metaDestination)

          if (metaContent && !metaContent.translated) {
            const inputFile = Bun.file(destination)
            const inputContent = await inputFile.text()
            console.log(`Starting translation for ${file}`)
            const translatedContent = await limiter.schedule(() =>
              translateMarkdownFile(inputContent, language)
            )
            await Bun.write(
              destination,
              translatedContent ?? "PIRI ErrorL: Couldn't translate file"
            )
            metaContent.translated = true
            await Bun.write(metaDestination, JSON.stringify(metaContent, null, 2))
            console.log(`Translated and updated ${file} at ${destination}`)
          } else {
            console.log(
              `Skipped ${file} for ${language.name} (${language.code}) as it's already translated`
            )
          }
        }
      })
    )
  )
}

// Process all contents for copying
const processCopyingContents = async () => {
  for (const content of CONTENTS) {
    for (const language of LANGUAGES) {
      console.log(`Copying files for language: ${language.name} (${language.code})`)
      await copyFilesForLanguage({ content, language })
    }
  }
}

// Process all contents for translating
const processTranslatingContents = async () => {
  for (const content of CONTENTS) {
    for (const language of LANGUAGES) {
      console.log(`Translating files for language: ${language.name} (${language.code})`)
      await translateFilesForLanguage({ content, language })
    }
  }
}

// Execute the process
const main = async () => {
  try {
    console.log('Starting the copying process...')
    await processCopyingContents()
    console.log('Copying process completed.')

    console.log('Starting the translating process...')
    await processTranslatingContents()
    console.log('Translating process completed.')
  } catch (error) {
    console.error('Error processing contents:', error)
  }
}

main()
