/**
 * Os 308 concelhos (lista das câmaras municipais da ANMP) e o feriado municipal de cada um, publicado SÓ quando foi
 * confirmado no sítio da própria câmara (src/data/concelhos.json: ligação, extrato e data de leitura). Um concelho sem
 * confirmação aparece com a ligação para a câmara, sem data.
 */
import DATA from '../../data/concelhos.json';
import type { Local, Regiao } from './feriados';

export interface Concelho extends Local {
  id: string; regiao: Regiao; camara: string;
  feriado: { regra: string; nome: string; url: string; extrato: string; lido: string } | null;
}
const RAW = (DATA as unknown as { concelhos: Concelho[] }).concelhos;
export const CONCELHOS: Concelho[] = [...RAW].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
export const CONFIRMADOS = CONCELHOS.filter((c) => c.feriado);
export const concelhoById = (id: string | undefined | null): Concelho | null => (id ? CONCELHOS.find((c) => c.id === id) ?? null : null);
export const REGIAO_NOME = { continente: { pt: 'Continente', en: 'Mainland' }, acores: { pt: 'Açores', en: 'Azores' }, madeira: { pt: 'Madeira', en: 'Madeira' } } as const;
