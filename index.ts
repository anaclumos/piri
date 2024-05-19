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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

// Translate content using OpenAI API
const translateContent = async (content: string, language: Language) => {
  const systemPrompt = `You are a helpful translator that translates technical documents from English (en) to ${language.name} (${language.code}).`
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content },
    ],
  })
  return response.choices[0].message.content
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
  console.table(files)
  for (const file of files) {
    if (file.endsWith('.md')) {
      const destination = join(targetPath, file)
      const metaDestination = `${destination}.meta.json`
      let metaContent = await readMetaFile(metaDestination)
      if (metaContent && !metaContent.translated) {
        const inputFile = Bun.file(destination)
        const inputContent = await inputFile.text()
        const translatedContent = await translateContent(inputContent, language)
        if (!translatedContent) {
          console.error('Failed to translate content:', file)
          continue
        }
        await Bun.write(destination, translatedContent)
        metaContent.translated = true
        await Bun.write(metaDestination, JSON.stringify(metaContent, null, 2))
        console.log(`Translated and updated ${file} at ${destination}`)
      }
    }
  }
}

// Process all contents for copying
const processCopyingContents = async () => {
  for (const content of CONTENTS) {
    for (const language of LANGUAGES) {
      await copyFilesForLanguage({ content, language })
    }
  }
}

// Process all contents for translating
const processTranslatingContents = async () => {
  for (const content of CONTENTS) {
    for (const language of LANGUAGES) {
      await translateFilesForLanguage({ content, language })
    }
  }
}

// Execute the process
const main = async () => {
  try {
    await processCopyingContents()
    await processTranslatingContents()
  } catch (error) {
    console.error('Error processing contents:', error)
  }
}

main()
