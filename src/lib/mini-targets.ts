/** Où mène le bouton d'un mini-simulateur : la première page qui porte le calculateur complet de ce type. */
import { ROUTES, route } from '../i18n/routes';
import { pageOfTool } from './pages';
import type { Lang } from './format';
/** L'optimiseur complet est sur l'accueil (2027), pas sur Pontes 2026 ; le prazo en jours ouvrés renvoie aux dias úteis. */
const CIBLE: Record<string, string> = { pt: 'home', pz: 'dias-uteis-2027' };
export const miniHref = (kind: string, lang: Lang, fallback: string) => { const id = CIBLE[kind] ?? pageOfTool(kind); return id && ROUTES.some((r) => r.id === id) ? route(id, lang) : fallback; };
