import { getInput, getMultilineInput, warning } from '@actions/core'
import { upload } from './upload'

upload({
  botId: getInput('bot-id', { required: true }),
  chatId: getInput('chat-id', { required: true }),
  filePath: getMultilineInput('file-path', { required: true }),
  topicId: getInput('topic-id', { required: false }),
  backend: getInput('backend', { required: false }),
  captionPath: getInput('caption-path', { required: false }),
  parseMode: getInput('parse-mode', { required: false }),
}).catch((e) => warning(e as Error))
