import type {
  UploadFunc,
  TelegramBaseResult,
  TelegramFailedResult,
  MediaDocument,
} from './types'
import { readFileSync } from 'fs'
import { basename } from 'path'
import { globSync } from 'glob'

class TelegramUploader {
  #botId: string
  #backend: string

  constructor(botId: string, backend: string) {
    this.#botId = botId
    this.#backend = backend
  }

  #useMethod(method: string, body: FormData) {
    return fetch(`https://${this.#backend}/bot${this.#botId}/${method}`, {
      method: 'POST',
      body,
    })
      .then((res) => res.json())
      .then((result) => {
        if (!(result as TelegramBaseResult).ok)
          throw new Error(
            (result as TelegramBaseResult as TelegramFailedResult).description,
          )
      })
  }

  sendFile(body: FormData) {
    return this.#useMethod('sendDocument', body)
  }

  sendFiles(body: FormData) {
    return this.#useMethod('sendMediaGroup', body)
  }
}

const distinct = <T>(array: T[]) => Array.from(new Set(array))

const getPuerPaths = (filePath: string[]) =>
  distinct(
    distinct(filePath.filter((path) => path !== ''))
      .map((path) => globSync(path))
      .flat(),
  )

export const upload: UploadFunc = async ({
  botId,
  chatId,
  filePath,
  backend = 'api.telegram.org',
  topicId = '',
  captionPath = '',
  parseMode = 'MarkdownV2',
}) => {
  filePath = getPuerPaths(filePath)
  if (filePath.length === 0) throw new Error('Empty file list')
  if (filePath.length > 10) throw new Error('Too many files')
  const bot = new TelegramUploader(botId, backend)
  const body = new FormData()
  body.append('chat_id', chatId)
  if (topicId !== '') body.append('message_thread_id', topicId)
  if (filePath.length == 1) {
    body.append(
      'document',
      new File([readFileSync(filePath[0]!)], basename(filePath[0]!)),
    )
    if (captionPath !== '') {
      body.append('caption', readFileSync(captionPath, { encoding: 'utf8' }))
      body.append('parse_mode', parseMode)
    }
    return bot.sendFile(body)
  }
  const documents = filePath.map(
    (path): MediaDocument => ({
      type: 'document',
      media: `attach://${basename(path)}`,
    }),
  )
  if (captionPath !== '') {
    documents.at(-1)!.caption = readFileSync(captionPath, { encoding: 'utf8' })
    documents.at(-1)!.parse_mode = parseMode
  }
  body.append('media', JSON.stringify(documents))
  for (const { name, file } of filePath.map((path) => ({
    name: basename(path),
    file: readFileSync(path),
  })))
    body.append(name, new File([file], name))
  return bot.sendFiles(body)
}
