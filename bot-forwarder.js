// bot-forwarder.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const upload = multer({ dest: 'tmp_uploads/' });
const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const BOT_CHAT_ID = process.env.BOT_CHAT_ID || '';

if(!BOT_TOKEN || !BOT_CHAT_ID) console.warn('BOT_TOKEN or BOT_CHAT_ID not set');

app.get('/', (req,res)=> res.send({ ok:true }));

app.post('/export', upload.single('file'), async (req,res) => {
  try {
    if(!req.file) return res.status(400).json({ ok:false, error:'no file' });
    const filePath = path.resolve(req.file.path);
    const stream = fs.createReadStream(filePath);

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
    const form = new FormData();
    form.append('chat_id', BOT_CHAT_ID);
    form.append('document', stream, { filename: req.file.originalname });
    if(req.body.meta) form.append('caption', `Chat export: ${req.body.meta}`);

    const headers = form.getHeaders();
    const tgRes = await axios.post(url, form, { headers, maxContentLength: Infinity, maxBodyLength: Infinity });
    fs.unlink(filePath, ()=>{});
    return res.json({ ok:true, telegram: tgRes.data });
  } catch(err){
    console.error('forward error', err.response?.data || err.message || err);
    return res.status(500).json({ ok:false, error: err.message || 'forward error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('bot-forwarder running on', PORT));
