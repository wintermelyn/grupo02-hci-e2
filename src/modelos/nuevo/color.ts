import colores from './colores.json'

type Rgb = [number, number, number]

const hexARgb = (hex: string): Rgb => [
  parseInt(hex.slice(0, 2), 16),
  parseInt(hex.slice(2, 4), 16),
  parseInt(hex.slice(4, 6), 16),
]

function rgbAHsl([r, g, b]: Rgb): Rgb {
  const [nr, ng, nb] = [r / 255, g / 255, b / 255]
  const max = Math.max(nr, ng, nb)
  const min = Math.min(nr, ng, nb)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h =
    max === nr ? (ng - nb) / d + (ng < nb ? 6 : 0) : max === ng ? (nb - nr) / d + 2 : (nr - ng) / d + 4
  return [h * 60, s, l]
}

function hslARgb([h, s, l]: Rgb): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  return [r, g, b].map((v) => Math.round((v + m) * 255)) as Rgb
}

const lineal = (v: number) => {
  const n = v / 255
  return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
}

const luminancia = ([r, g, b]: Rgb) => 0.2126 * lineal(r) + 0.7152 * lineal(g) + 0.0722 * lineal(b)

/** WCAG. Blanco contra el tono: 1,05 / (L + 0,05). */
const contrasteBlanco = (rgb: Rgb) => 1.05 / (luminancia(rgb) + 0.05)

const css = ([r, g, b]: Rgb) => `rgb(${r} ${g} ${b})`

const CONTRASTE_MINIMO = 8.5

/**
 * El tono de la portada, oscurecido hasta que el texto blanco pase de 8,5:1, para que también su
 * variante al 88 % de opacidad conserve 4,5:1 con holgura. Es el color de fondo de las tarjetas de portada.
 */
export function tonoProfundo(bookId: string): string {
  const hex = (colores as Record<string, string | null>)[bookId]
  // Una portada sin color propio toma la tinta del sistema: forzarle saturación inventa un tono.
  if (!hex) return 'rgb(50 43 38)'
  const [matiz, s] = rgbAHsl(hexARgb(hex))
  // Los azules que derivan a índigo se quedan en azul: violeta e índigo no son de esta paleta.
  // Y los amarillos, que al oscurecerse se vuelven oliva, pasan a ámbar.
  const h = matiz > 232 && matiz < 300 ? 226 : matiz > 40 && matiz < 78 ? 33 : matiz
  const saturacion = Math.min(Math.max(s, 0.5), 0.82)
  for (let l = 0.42; l > 0.05; l -= 0.01) {
    const rgb = hslARgb([h, saturacion, l])
    if (contrasteBlanco(rgb) >= CONTRASTE_MINIMO) return css(rgb)
  }
  return css(hslARgb([h, saturacion, 0.1]))
}
