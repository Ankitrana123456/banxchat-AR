// export-bot.js
// client-side; requires firebase initialized and 'db' variable available
async function exportChatAndSendToBot(convoId, forwarderUrl) {
  if(!convoId) throw new Error('convoId required');
  if(!forwarderUrl) throw new Error('forwarderUrl required');
  try {
    const msgsSnap = await db.collection('convos').doc(convoId).collection('msgs').orderBy('ts','asc').get();
    const msgs = msgsSnap.docs.map(d=>({ id:d.id, ...d.data() }));
    const payload = { exported_by: firebase.auth().currentUser.uid, exported_at: Date.now(), convo_id: convoId, messages: msgs };
    const blob = new Blob([JSON.stringify(payload,null,2)], { type:'application/json' });
    const form = new FormData(); const filename = `chat-export-${payload.exported_by}-${Date.now()}.json`;
    form.append('file', blob, filename); form.append('meta', JSON.stringify({ convoId }));
    const res = await fetch(forwarderUrl, { method:'POST', body: form });
    if(res.ok){ alert('Export sent to bot'); return await res.json(); }
    else { const txt = await res.text(); console.warn('forwarder error', txt); triggerDownload(filename, JSON.stringify(payload,null,2)); alert('Forward failed; JSON downloaded'); return null; }
  } catch(err){
    console.error(err); triggerDownload(`chat-export-fail-${Date.now()}.json`, JSON.stringify({ error: err.message }, null,2)); alert('Export failed; JSON downloaded');
  }
}
function triggerDownload(filename, content) { const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content], { type:'application/json' })); a.download=filename; document.body.appendChild(a); a.click(); a.remove(); }
