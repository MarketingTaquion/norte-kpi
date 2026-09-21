// Techo poblacional: límite superior de "personas alcanzables" en una
// localidad y plataforma dadas, para que la calculadora nunca proyecte más
// alcance/seguidores que la cantidad de gente que realmente vive ahí.
//
// Fuentes: población — INDEC Censo Nacional 2022 (ver src/data/territorios.js).
// Penetración de internet y de cada plataforma en Argentina — DataReportal
// "Digital 2026: Argentina" (oct. 2025), sobre base de usuarios de internet,
// no de población total (por eso INTERNET_PENETRATION_PCT se aplica aparte).
// Pirámide etaria — INDEC Censo 2022 (ver src/data/rangosEtarios.js). El
// factor por rubro (src/data/rubros.js) es una estimación interna, no tiene
// fuente externa — ver el comment ahí.
import { TERRITORIOS } from '../../data/territorios.js';
import { RANGOS_ETARIOS } from '../../data/rangosEtarios.js';
import { RUBROS } from '../../data/rubros.js';

export const INTERNET_PENETRATION_PCT = 0.906;

// % de usuarios de internet de Argentina que usa cada plataforma — fuente
// arriba. 'internet' = sin recorte de plataforma (search/SEO: casi cualquier
// usuario de internet es alcanzable ahí, el techo es la población con
// internet directamente).
const PLATFORM_PENETRATION_OF_INTERNET = {
  instagram: 0.747,
  // Proxy de alcance unificado de Meta (Instagram + Facebook): se usa el
  // mayor de los dos individualmente, no la suma — sumarlos sobreestimaría
  // por gente que usa ambas plataformas.
  meta: 0.747,
  facebook: 0.705,
  tiktok: 0.703,
  linkedin: 0.433,
  x: 0.161,
  internet: 1,
};

// A qué familia de penetración corresponde cada value de PLATFORM_GROUPS
// (src/data/platforms.js). Las plataformas que no aparecen acá (Programática,
// Mercado Ads, Email marketing, Influencers, PR/Prensa, Eventos) no tienen
// techo poblacional aplicable con los datos disponibles hoy — su proyección
// no se recorta.
const PLATFORM_FAMILIA = {
  'meta-ads': 'meta',
  'instagram-organico': 'instagram',
  'facebook-organico': 'facebook',
  'tiktok-ads': 'tiktok',
  'tiktok-organico': 'tiktok',
  'google-ads': 'internet',
  seo: 'internet',
  'linkedin-ads': 'linkedin',
  'linkedin-organico': 'linkedin',
  'x-ads': 'x',
};

export function findTerritorio(value) {
  return TERRITORIOS.find((t) => t.value === value) || null;
}

export function findRangoEtario(value) {
  return RANGOS_ETARIOS.find((r) => r.value === value) || null;
}

export function findRubro(value) {
  return RUBROS.find((r) => r.value === value) || null;
}

// Devuelve el techo de personas alcanzables para esa plataforma en esa
// localidad, o null si no hay territorio declarado o la plataforma no tiene
// familia de penetración conocida — en esos casos no se aplica recorte.
export function techoPoblacional(territorio, plataformaValue, rangoEtario, rubro) {
  if (!territorio) return null;
  const familia = PLATFORM_FAMILIA[plataformaValue];
  const penetracion = familia ? PLATFORM_PENETRATION_OF_INTERNET[familia] : null;
  if (penetracion == null) return null;
  const pctEtario = rangoEtario ? rangoEtario.pct : 1;
  const factorRubro = rubro ? rubro.factor : 1;
  return Math.round(territorio.poblacion * INTERNET_PENETRATION_PCT * penetracion * pctEtario * factorRubro);
}
