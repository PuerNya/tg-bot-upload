# tg-bot-upload

Using telegram bot to upload something

## Usage

```yaml
- uses: PuerNya/tg-bot-upload@v1
  with:
    bot-id: <telegram_bot_id>
    chat-id: <telegram_chat_id>
    # topic-id: <telegram_chat_topic_id>
    file-path: <file_path>
    # support multiline wildcard
    # e.g:
    # file-path: |
    #   *.txt
    #   *.md
    # caption-path: <caption_path>
    # parse-mode: MarkdownV2
    # you can use '' 'MarkdownV2' 'HTML'
```
