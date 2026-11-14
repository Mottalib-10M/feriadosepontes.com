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

/* Contração da preposição com o artigo do nome (testeurs naïfs du 2026-11-14 : « Feriado municipal de Porto »).
 * Só os concelhos cujo nome leva artigo sem dúvida; os outros ficam « de X » / « em X ». */
const COM_O = new Set(['Porto', 'Porto Santo', 'Funchal', 'Barreiro', 'Seixal', 'Montijo', 'Entroncamento', 'Cartaxo', 'Bombarral', 'Cadaval', 'Fundão', 'Sardoal', 'Crato', 'Redondo', 'Alandroal', 'Nordeste', 'Corvo', 'Gavião', 'Sabugal']);
const COM_A = new Set(['Amadora', 'Moita', 'Nazaré', 'Covilhã', 'Lousã', 'Mealhada', 'Murtosa', 'Maia', 'Horta', 'Trofa', 'Batalha', 'Guarda', 'Golegã', 'Chamusca', 'Azambuja', 'Sertã', 'Mêda', 'Anadia', 'Lourinhã', 'Madalena', 'Povoação', 'Vidigueira', 'Calheta', 'Ribeira Grande', 'Ribeira Brava', 'Praia da Vitória', 'Figueira da Foz', 'Pampilhosa da Serra', 'Marinha Grande', 'Póvoa de Varzim', 'Póvoa de Lanhoso']);
const artigo = (nome: string) => { const b = nome.replace(/ \((Açores|Madeira|Algarve)\)$/, ''); return COM_O.has(b) ? 'o' : COM_A.has(b) ? 'a' : ''; };
/** « de Lisboa », « do Porto », « da Amadora ». */
export const deNome = (nome: string) => ({ o: 'do', a: 'da', '': 'de' } as const)[artigo(nome)] + ' ' + nome;
/** « em Lisboa », « no Porto », « na Amadora ». */
export const emNome = (nome: string) => ({ o: 'no', a: 'na', '': 'em' } as const)[artigo(nome)] + ' ' + nome;
