# Bot Export API (Forwarder)

POST /export
- Content-Type: multipart/form-data
- Fields:
  - file: (required) chat export JSON file
  - meta: (optional) JSON string with metadata { convoId, exported_by }

Response:
- 200: { ok:true, telegram: {...} }
- 4xx/5xx: { ok:false, error: '...' }

Telegram: forwarder uses Bot API sendDocument to BOT_CHAT_ID
