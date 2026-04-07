export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('[claude] ANTHROPIC_API_KEY is not set')
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  console.log('[claude] proxying request, model:', req.body?.model)

  let response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })
  } catch (err) {
    console.error('[claude] fetch failed:', err)
    return res.status(502).json({ error: 'Failed to reach Anthropic API', detail: String(err) })
  }

  let data
  try {
    data = await response.json()
  } catch (err) {
    console.error('[claude] failed to parse response, status:', response.status)
    return res.status(502).json({ error: 'Invalid response from Anthropic API' })
  }

  if (!response.ok) {
    console.error('[claude] Anthropic error', response.status, JSON.stringify(data))
  }

  res.status(response.status).json(data)
}
