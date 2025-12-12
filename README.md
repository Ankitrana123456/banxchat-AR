# Ban X Chat — Export to Bot Integration (Guide)

This repository contains helper files to **export user-approved chat JSON** and send it to a Telegram bot (forwarder).  
**Important:** Do NOT commit your Telegram bot token to the repo. Use environment variables on the server.

## Files included in this partial deliverable
- `export-bot.js` — client helper to request a chat export and POST it to forwarder
- `bot-forwarder.js` — small Node/Express server that accepts exported chat JSON and forwards to Telegram via Bot API
- `firebase.rules` — recommended starter Firestore / Storage rules

---

## How it works (safe & legal)
1. User clicks **Export Chat** in the app (home.html). This action is explicit consent.  
2. The app builds the chat JSON and calls the Export endpoint (configured client-side) — e.g. `https://your-forwarder.example.com/export`.  
3. The forwarder server receives the JSON, creates a `.json` file, and uses the **server-side** bot token to upload it to Telegram using Bot API `sendDocument` to your configured chat ID.  
4. Server returns success/failure to client.

This avoids exposing your bot token to browsers and works around CORS limitations with Telegram API.

---

## Deploy the forwarder server (recommended: Render or Railway)

### 1) Create a new Render service (Web Service)
- Repo: create new render service and point to repo containing `bot-forwarder.js`.
- Build command: `npm install`
- Start command: `node bot-forwarder.js`
- In Environment variables add:
  - `BOT_TOKEN` = your bot token (e.g. `8584593233:AAEutJXO3coIrPrCkbmlkqwuNRrMxkGTkfc`)
  - `BOT_CHAT_ID` = your chat id (e.g. `5302639580`)

### 2) Local testing
- Install dependencies: `npm install express axios form-data multer`
- Run: `BOT_TOKEN=... BOT_CHAT_ID=... node bot-forwarder.js`
- POST exported JSON to `http://localhost:3000/export` (multipart/form-data or JSON body) — see `export-bot.js` usage.

---

## Client integration (home.html)
- Include `export-bot.js` helper script in your `home.html` and call `exportChatAndSendToBot(convoId, forwarderUrl)` on user click.
- `export-bot.js` will:
  - fetch messages for the convo from Firestore (client-side)
  - build JSON
  - POST to forwarder endpoint
  - fallback: trigger download of JSON if forwarding fails

---

## Bot webhook spec (for your bot)
- The forwarder sends the exported JSON to the Telegram Bot API as a file named `chat-export-<uid>-<ts>.json`.  
- Your bot will receive it as a normal incoming document message (same as any uploaded file). From there your bot logic can download and process the JSON.

---

## Security notes
- **Never** commit BOT_TOKEN into a public repo. Use environment variables on the server.
- User export occurs only when the user explicitly clicks "Export Chat".
- The forwarder **does not** store the JSON permanently (server deletes temp file after sending).

---

If you want, I can also:
- produce a GitHub Actions workflow to deploy the forwarder automatically to Render/Heroku,
- or produce a one-click Render deployment link.

Tell me which and I'll add it.
