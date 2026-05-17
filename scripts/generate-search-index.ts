import fs from 'fs';
import path from 'path';

interface CelularData {
  slug: string;
  marca: string;
  modelo: string;
  especificacoes: {
    processador: string;
    ram: string;
    armazenamento: string;
    tela: string;
    bateria: string;
  };
  avaliacoes_logicas: {
    custo_beneficio: number;
    hardware: number;
    camera: number;
  };
}

interface PrecoData {
  slug: string;
  historico_precos: Array<{
    data: string;
    preco: number;
    url_afiliado: string;
    loja: string;
  }>;
}

interface SearchIndexItem {
  slug: string;
  marca: string;
  modelo: string;
  processador: string;
  ram: string;
  armazenamento: string;
  tela: string;
  bateria: string;
  preco: number | null;
  custo_beneficio: number;
  hardware: number;
  camera: number;
}

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

function getPrecoAtual(slug: string): number | null {
  const filePath = path.join(DATA_DIR, 'precos', `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const preco = JSON.parse(content) as PrecoData;
  
  if (preco.historico_precos.length === 0) {
    return null;
  }
  
  return preco.historico_precos[0].preco;
}

function generateSearchIndex(): SearchIndexItem[] {
  const celulares = getAllCelulares();
  
  return celulares.map(celular => ({
    slug: celular.slug,
    marca: celular.marca,
    modelo: celular.modelo,
    processador: celular.especificacoes.processador,
    ram: celular.especificacoes.ram,
    armazenamento: celular.especificacoes.armazenamento,
    tela: celular.especificacoes.tela,
    bateria: celular.especificacoes.bateria,
    preco: getPrecoAtual(celular.slug),
    custo_beneficio: celular.avaliacoes_logicas.custo_beneficio,
    hardware: celular.avaliacoes_logicas.hardware,
    camera: celular.avaliacoes_logicas.camera,
  }));
}

function saveSearchIndex(): void {
  const index = generateSearchIndex();
  const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
  
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`✓ Índice de busca gerado em: ${outputPath}`);
  console.log(`✓ Total de celulares indexados: ${index.length}`);
}

saveSearchIndex();
