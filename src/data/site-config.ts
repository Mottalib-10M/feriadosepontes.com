/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://feriadosepontes.com";
export const SITE_NAMES: Record<string, string> = {"pt": "Feriados e Pontes", "en": "Feriados e Pontes"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "Pontes";
export const LANG_TAGS: Record<string, string> = {"pt": "pt-PT", "en": "en-GB"};
export const OG_LOCALES: Record<string, string> = {"pt": "pt_PT", "en": "en_GB"};
export const LOCALE_TAG = 'pt-PT';
/** Formats de nombres et de dates par langue de page. */
export const NUM_TAGS: Record<string, string> = { pt: 'pt-PT', en: 'en-GB', 'pt-PT': 'pt-PT', 'en-GB': 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-11-13';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"pt": "Editor independente de um calendário que calcula feriados nacionais, feriados municipais dos 308 concelhos e pontes do ano em Portugal", "en": "Independent publisher of a calendar that works out Portugal's national holidays, the municipal holidays of its 308 municipalities and the year's long weekends"};
export const AUTHOR_DESC: Record<string, string> = {"pt": "A Radif Partners lê os artigos 234.º e 235.º do Código do Trabalho, calcula a Páscoa com o algoritmo gregoriano e confirma o feriado municipal de cada concelho no sítio da respetiva câmara municipal, com a ligação e a data de leitura. Daí tira as pontes, os dias úteis e o calendário de 2026 a 2028, tudo no navegador. Não vende viagens, hotéis nem calendários e não pede dados pessoais.", "en": "Radif Partners reads articles 234 and 235 of Portugal's Labour Code, computes Easter with the Gregorian algorithm and checks each municipality's holiday on its own câmara municipal website, with the link and the date it was read. From that it derives long weekends, working days and the 2026 to 2028 calendar, all in your browser. It sells no trips, hotels or calendars and asks for no personal data."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"pt": ["Feriados nacionais em Portugal (Código do Trabalho, art. 234.º)", "Feriados facultativos e feriado municipal (art. 235.º)", "Pontes e marcação de férias", "Cálculo da data da Páscoa", "Feriados regionais dos Açores e da Madeira", "Dias úteis"], "en": ["Portuguese national public holidays (Labour Code, art. 234)", "Optional holidays and municipal holidays (art. 235)", "Long weekends and leave planning in Portugal", "Computing the date of Easter", "Regional holidays in the Azores and Madeira", "Working days"]};
export const CONTACT_EMAIL = "contact@feriadosepontes.com";
export const THEME_COLOR = '#9A3412';
export const LOGO_SYMBOL = 'FP';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-19N26F1MS8';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'zdgbe2ox59';
export const INDEXNOW_KEY = '20ccfdf8050e41a41bb939942f8e731d';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',
  legalForm: '',
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "França / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub Pages (GitHub, Inc.)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
