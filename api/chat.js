// Servidor de Delytel: guarda tu API key en secreto y habla con Gemini (plan gratuito).
// Si Google está saturado (503) reintenta y prueba modelos alternativos.
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'no_key', detail: 'Falta GEMINI_API_KEY en Vercel (agregarla y hacer Redeploy)' });
  const primary = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const models = [...new Set([primary, primary, 'gemini-flash-lite-latest', 'gemini-flash-latest'])];
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'bad_json' }); } }
  const msgs = ((body && body.messages) || []).slice(-20);
  if (!msgs.length || JSON.stringify(msgs).length > 60000) return res.status(400).json({ error: 'bad_size' });
  const contents = msgs.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content).slice(0, 20000) }]
  }));
  const payload = JSON.stringify({ contents, generationConfig: { temperature: 0.8, maxOutputTokens: 8192 } });
  let last = { status: 502, detail: 'sin respuesta' };
  for (let i = 0; i < models.length; i++) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${models[i]}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: payload
      });
      if (r.ok) {
        const j = await r.json();
        const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('');
        if (text) return res.status(200).json({ text });
        last = { status: 502, detail: 'Gemini no devolvió texto' };
      } else {
        let d = ''; try { d = (await r.text()).slice(0, 250); } catch {}
        last = { status: r.status, detail: `Gemini ${r.status} (${models[i]}): ${d}` };
      }
    } catch (e) { last = { status: 502, detail: 'Sin conexión con Gemini' }; }
    if (i < models.length - 1) await sleep(i === 0 ? 1200 : 300);
  }
  return res.status(last.status === 429 ? 429 : 502).json({ error: 'upstream', detail: last.detail });
};
