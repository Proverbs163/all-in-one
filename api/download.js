// /api/download.js  (Vercel)
// Uses RapidAPI: social-download-all-in-one (autolink)
// Expects env var: RAPIDAPI_KEY

export default async function handler(req, res) {
  try {
    const url = req.query.url || (req.body && req.body.url);
    if (!url) {
      return res.status(400).json({ error: 'Missing video URL ?url=' });
    }

    const apiRes = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
      },
      body: JSON.stringify({ url })
    });

    const data = await apiRes.json();

    // Normalize result: some endpoints return { links: [...] } or { medias: [...] }
    let normalized = data;
    if (!normalized.medias && Array.isArray(data.links)) {
      normalized = {
        title: data.title || '',
        picture: data.picture || '',
        duration: data.duration || '',
        medias: data.links
      };
    }

    return res.status(200).json(normalized);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
