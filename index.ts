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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
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

// Translate text using OpenAI API
const translateText = async (text: string, language: Language) => {
  const systemPrompt = `You are a helpful translator that translates technical texts. Do not translate code blocks or text inside <angle brackets> such as <Intro> or {/* markdown comments */}. However, if JSX Objects have an English description or string inside, only translate the English text. Do not translate proper nouns, brand names, or tech jargon such as Server Components, React, or React Native. Translate the following text to ${language.name} (${language.code}). Do not respond. Start the translation immediately:`
  console.log(
    `Translating text for language: ${language.name} (${language.code}). Text: ${text
      .substring(0, 30)
      .replaceAll('\n', ' ')}...`
  )
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    temperature: 0,
  })
  console.log(
    `Translation completed for language: ${language.name} (${
      language.code
    }). Text: ${response.choices[0].message.content?.substring(0, 30).replaceAll('\n', ' ')}...`
  )
  return response.choices[0].message.content
}

// Extract and translate frontmatter values
const translateFrontmatter = async (frontmatter: string, language: Language) => {
  const lines = frontmatter.split('\n')
  const translatedLines = []
  for (const line of lines) {
    const [key, value] = line.split(': ')
    if (key === 'title' || key === 'description') {
      const translatedValue = await translateText(value, language)
      translatedLines.push(`${key}: ${translatedValue}`)
    } else {
      translatedLines.push(line)
    }
  }
  return translatedLines.filter(Boolean).join('\n')
}

// Translate paragraphs of the markdown content
const translateMarkdownContent = async (content: string, language: Language) => {
  console.log(`Translating markdown content for language: ${language.name} (${language.code})`)
  const paragraphs = content.split('\n\n')
  const translatedParagraphs = []
  for (const paragraph of paragraphs) {
    if (
      (paragraph.startsWith('</') && paragraph.endsWith('>')) ||
      (paragraph.startsWith('```') && paragraph.endsWith('```')) ||
      (paragraph.startsWith('{/*') && paragraph.endsWith('*/}'))
    ) {
      translatedParagraphs.push(paragraph)
    } else {
      console.log(`Translating paragraph: ${paragraph.substring(0, 30).replaceAll('\n', ' ')}...`)
      const translatedParagraph = await translateText(paragraph, language)
      translatedParagraphs.push(translatedParagraph)
    }
  }
  return translatedParagraphs.join('\n\n')
}

// Handle translation of markdown files
const translateMarkdownFile = async (inputContent: string, language: Language) => {
  console.log(`Translating markdown file for language: ${language.name} (${language.code})`)
  let frontmatter = ''
  let content = inputContent
  if (inputContent.startsWith('---')) {
    const endOfFrontmatter = inputContent.indexOf('---', 3) + 3
    frontmatter = inputContent.slice(0, endOfFrontmatter)
    content = inputContent.slice(endOfFrontmatter).trim()
    frontmatter = await translateFrontmatter(frontmatter, language)
  }
  const translatedContent = await translateMarkdownContent(content, language)
  return `${frontmatter}\n\n${translatedContent}`
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
    if (file.endsWith('.md')) {
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
  for (const file of files) {
    if (file.endsWith('.md')) {
      const destination = join(targetPath, file)
      const metaDestination = `${destination}.meta.json`

      let metaContent = await readMetaFile(metaDestination)

      if (metaContent && !metaContent.translated) {
        const inputFile = Bun.file(destination)
        const inputContent = await inputFile.text()
        console.log(`Starting translation for ${file}`)
        const translatedContent = await translateMarkdownFile(inputContent, language)
        await Bun.write(destination, translatedContent)
        metaContent.translated = true
        await Bun.write(metaDestination, JSON.stringify(metaContent, null, 2))
        console.log(`Translated and updated ${file} at ${destination}`)
      } else {
        console.log(
          `Skipped ${file} for ${language.name} (${language.code}) as it's already translated`
        )
      }
    }
  }
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
