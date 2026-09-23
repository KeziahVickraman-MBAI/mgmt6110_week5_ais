// /api/bus-stops.js - Serverless function to search and retrieve official Singapore LTA bus stops
// Sibling of package.json at api/ in the project root
import fs from 'node:fs';
import path from 'node:path';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('Content-Type', 'application/json');

  let query = '';
  if (req.query && req.query.search) {
    query = String(req.query.search).trim().toLowerCase();
  } else if (req.url) {
    try {
      const host = req.headers?.host || 'localhost';
      const parsedUrl = new URL(req.url, `http://${host}`);
      query = (parsedUrl.searchParams.get('search') || '').trim().toLowerCase();
    } catch {
      // keep empty
    }
  }

  let stops = [];
  try {
    const jsonPath = path.resolve(process.cwd(), 'src/data/ltaBusStopsData.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      stops = JSON.parse(raw);
    }
  } catch (err) {
    stops = [];
  }

  const results = stops.filter((stop) => {
    if (!query) return true;
    return (
      (stop.code && stop.code.includes(query)) ||
      (stop.name && stop.name.toLowerCase().includes(query)) ||
      (stop.road && stop.road.toLowerCase().includes(query))
    );
  });

  res.statusCode = 200;
  return res.end(JSON.stringify({ stops: results }));
}
