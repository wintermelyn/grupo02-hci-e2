export type Modelo = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'

// Vista previa del modelo aprobado: toda la app corre con G, en la raíz del sitio.
export const MODELO = 'g' as Modelo
export const BASENAME = ''
/** Las propuestas nuevas: su propio marco de navegación, Inicio y Buscar. */
export const ES_NUEVO = true

document.documentElement.dataset.modelo = MODELO
