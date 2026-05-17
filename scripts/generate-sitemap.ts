import fs from 'fs';
import path from 'path';

interface CelularData {
  slug: string;
  marca: string;
  modelo: string;
}

const SITE_URL = 'https://celular-compare.vercel.app';
const DATA_DIR = path.join(process.cwd(), '..', 'celular-compare', 'data');

function getAllCelulares(): CelularData[] {
  const celularesDir = path.join(DATA_DIR, 'celulares');
  
  if (!fs.existsSync(celularesDir)) {
    return [];
  }

  const files = fs.readdirSync(celularesDir).filter(f => f.endsWith('.json') && f !== 'exemplo-celular.json');
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(celularesDir, file), 'utf-8');
    return JSON.parse(content) as CelularData;
  });
}

function generateSitemap(): string {
  const celulares = getAllCelulares();
  
  // URLs estáticas
  const staticUrls = [
    { loc: '/', lastmod: new Date().toISOString().split('T')[0], priority: '1.0' },
    { loc: '/celulares', lastmod: new Date().toISOString().split('T')[0], priority: '0.9' },
    { loc: '/busca', lastmod: new Date().toISOString().split('T')[0], priority: '0.8' },
  ];

  // URLs dinâmicas de produtos
  const productUrls = celulares.map(celular => ({
    loc: `/celulares/${celular.slug}`,
    lastmod: new Date().toISOString().split('T')[0],
    priority: '0.8',
  }));

  // URLs de comparação (todas as combinações)
  const comparisonUrls: Array<{ loc: string; lastmod: string; priority: string }> = [];
  for (let i = 0; i < celulares.length; i++) {
    for (let j = i + 1; j < celulares.length; j++) {
      comparisonUrls.push({
        loc: `/compare/${celulares[i].slug}-vs-${celulares[j].slug}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.7',
      });
    }
  }

  // Combina todas as URLs
  const allUrls = [...staticUrls, ...productUrls, ...comparisonUrls];

  // Gera XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allUrls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

function saveSitemap(): void {
  const sitemap = generateSitemap();
  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemap);
  console.log(`✓ Sitemap gerado em: ${outputPath}`);
  console.log(`✓ Total de URLs: ${generateSitemap().match(/<url>/g)?.length || 0}`);
}

saveSitemap();
