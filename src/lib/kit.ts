/**
 * Trousse de rédaction : tout chiffre et toute date écrits dans une page viennent d'ici, jamais tapés à la main.
 *   K.P                         paramètres datés (params-2026.json)
 *   K.feriados, K.pascoa, K.carnaval, K.dataRegra, K.nthWeekday …   engine/feriados.ts
 *   K.otimiza, K.pontes, K.pontesDeUmDia, K.diasUteis, K.isoWeek …   engine/pontes.ts
 *   K.CONCELHOS, K.CONFIRMADOS, K.concelhoById                        engine/concelhos.ts
 *   K.tool(kind, lang, args, valori)  lance un calculateur de tool-specs.ts
 */
import P from '../data/params-2026.json';
import * as F from './engine/feriados';
import * as B from './engine/pontes';
import * as C from './engine/concelhos';
import { runTool } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, ...F, ...B, ...C, tool: runTool, LIDO_EM: LAST_UPDATED };
export type Kit = typeof KIT;
