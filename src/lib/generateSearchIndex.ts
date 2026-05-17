import fs from 'fs';
import path from 'path';
import { getAllCelulares, getPrecoAtual } from './data';

export interface SearchIndexItem {
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

export function generateSearchIndex(): SearchIndexItem[] {
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

export function saveSearchIndex(outputPath: string): void {
  const index = generateSearchIndex();
  const dir = path.dirname(outputPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
}
