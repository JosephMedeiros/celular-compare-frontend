import fs from 'fs';
import path from 'path';

export interface Celular {
  slug: string;
  marca: string;
  modelo: string;
  especificacoes: {
    processador: string;
    ram: string;
    armazenamento: string;
    tela: string;
    bateria: string;
    cameras: {
      principal: string;
      ultrawide?: string;
      telefoto?: string;
      frontal: string;
    };
  };
  avaliacoes_logicas: {
    custo_beneficio: number;
    hardware: number;
    camera: number;
  };
}

export interface PrecoHistorico {
  slug: string;
  historico_precos: Array<{
    data: string;
    preco: number;
    url_afiliado: string;
    loja: string;
  }>;
}

export interface Marca {
  slug: string;
  nome: string;
  site_oficial?: string;
}

const DATA_DIR = path.join(process.cwd(), '..', 'celular-compare', 'data');

export function getAllCelulares(): Celular[] {
  const celularesDir = path.join(DATA_DIR, 'celulares');
  
  if (!fs.existsSync(celularesDir)) {
    return [];
  }

  const files = fs.readdirSync(celularesDir).filter(f => f.endsWith('.json') && f !== 'exemplo-celular.json');
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(celularesDir, file), 'utf-8');
    return JSON.parse(content) as Celular;
  });
}

export function getCelularBySlug(slug: string): Celular | null {
  const filePath = path.join(DATA_DIR, 'celulares', `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as Celular;
}

export function getPrecoHistorico(slug: string): PrecoHistorico | null {
  const filePath = path.join(DATA_DIR, 'precos', `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as PrecoHistorico;
}

export function getAllMarcas(): Marca[] {
  const marcasDir = path.join(DATA_DIR, 'marcas');
  
  if (!fs.existsSync(marcasDir)) {
    return [];
  }

  const files = fs.readdirSync(marcasDir).filter(f => f.endsWith('.json') && f !== 'exemplo-marca.json');
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(marcasDir, file), 'utf-8');
    return JSON.parse(content) as Marca;
  });
}

export function getMarcaBySlug(slug: string): Marca | null {
  const filePath = path.join(DATA_DIR, 'marcas', `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as Marca;
}

export function getPrecoAtual(slug: string): number | null {
  const preco = getPrecoHistorico(slug);
  if (!preco || preco.historico_precos.length === 0) {
    return null;
  }
  return preco.historico_precos[0].preco;
}

export function getUrlAfiliado(slug: string): string | null {
  const preco = getPrecoHistorico(slug);
  if (!preco || preco.historico_precos.length === 0) {
    return null;
  }
  return preco.historico_precos[0].url_afiliado;
}

export function getMediaPreco(slug: string): number | null {
  const preco = getPrecoHistorico(slug);
  if (!preco || preco.historico_precos.length === 0) {
    return null;
  }
  
  const soma = preco.historico_precos.reduce((acc, p) => acc + p.preco, 0);
  return soma / preco.historico_precos.length;
}

export function getPrecoMinimo(slug: string): number | null {
  const preco = getPrecoHistorico(slug);
  if (!preco || preco.historico_precos.length === 0) {
    return null;
  }
  
  return Math.min(...preco.historico_precos.map(p => p.preco));
}

export function getPrecoMaximo(slug: string): number | null {
  const preco = getPrecoHistorico(slug);
  if (!preco || preco.historico_precos.length === 0) {
    return null;
  }
  
  return Math.max(...preco.historico_precos.map(p => p.preco));
}
