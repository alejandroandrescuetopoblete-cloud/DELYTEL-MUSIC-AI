// Servidor de Delytel: guarda tu API key en secreto y habla con Gemini (plan gratuito).
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'no_key' });
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'bad_json' }); } }
  const msgs = ((body && body.messages) || []).slice(-20);
  if (!msgs.length || JSON.stringify(msgs).length > 60000) return res.status(400).json({ error: 'bad_size' });
  const contents = msgs.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content).slice(0, 20000) }]
  }));
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents, generationConfig: { temperature: 0.8, maxOutputTokens: 8192 } })
    });
    if (!r.ok) return res.status(r.status === 429 ? 429 : 502).json({ error: 'upstream' });
    const j = await r.json();
    const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('');
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: 'network' });
  }
};
