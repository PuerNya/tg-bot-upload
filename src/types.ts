interface UploadConfig {
  botId: string
  chatId: string
  filePath: string[]
  backend?: string
  topicId?: string
  captionPath?: string
  parseMode?: string
}

export interface MediaDocument {
  type: 'document'
  media: string
  caption?: string
  parse_mode?: string
}

export type UploadFunc = (config: UploadConfig) => Promise<void>

export interface TelegramBaseResult {
  ok: boolean
}

export interface TelegramFailedResult extends TelegramBaseResult {
  description: string
}
