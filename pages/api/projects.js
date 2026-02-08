export default async function handler(req, res) {
  const { q } = req.query;
  try {
    // Vercel appelle ton VPS en secret
    const response = await fetch(`http://88.178.167.134:1067/api/projects?q=${q || ''}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Impossible de contacter le VPS" });
  }
}
