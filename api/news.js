export default async function handler(req, res) {
    try {
      const response = await fetch(
        'https://newsapi.org/v2/top-headlines?country=in&apiKey=366a240e6df2457d94f526d2d18c179b'
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'News fetch failed' });
    }
  }
  