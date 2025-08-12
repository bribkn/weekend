import { Holiday } from '@/domain/date'
import {
  format,
  parseISO,
  addDays,
  isWeekend,
  isSaturday,
  isSunday,
  isFriday,
  isMonday,
  differenceInCalendarDays,
  eachDayOfInterval,
} from 'date-fns'
import { es } from 'date-fns/locale'

export const formatFechaPalabras = (dateStr: string) => {
  try {
    const date = parseISO(dateStr)
    return format(date, "EEEE, dd 'de' MMMM", { locale: es }).replace(/^([a-záéíóúüñ])/i, (c) =>
      c.toUpperCase(),
    )
  } catch {
    return dateStr
  }
}

export function calcularFinesDeSemanaLargos(feriados: Holiday[]): LongWeekend[] {
  if (feriados.length === 0) return []
  const year = parseISO(feriados[0].date).getFullYear()
  const fechasFeriadosSet = new Set(feriados.map((f) => f.date))
  const dias: { date: Date; feriado?: Holiday }[] = []
  feriados.forEach((f) => {
    const d = parseISO(f.date)
    dias.push({ date: d, feriado: f })
  })
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  eachDayOfInterval({ start, end }).forEach((d) => {
    const dateStr = format(d, 'yyyy-MM-dd')
    if (!fechasFeriadosSet.has(dateStr)) {
      dias.push({ date: d })
    }
  })
  dias.sort((a, b) => a.date.getTime() - b.date.getTime())

  const fines: LongWeekend[] = []
  for (let i = 0; i < dias.length; i++) {
    for (let j = i + 2; j < dias.length; j++) {
      if (dias[j].date.getFullYear() !== year) break
      const intervalo = dias.slice(i, j + 1)
      const tieneSabado = intervalo.some((d) => isSaturday(d.date))
      const tieneDomingo = intervalo.some((d) => isSunday(d.date))
      if (!tieneSabado || !tieneDomingo) continue
      let valido = true
      const feriadosIncluidos: Holiday[] = []
      for (const d of intervalo) {
        if (!isSaturday(d.date) && !isSunday(d.date)) {
          if (!d.feriado) {
            valido = false
            break
          } else {
            feriadosIncluidos.push(d.feriado)
          }
        } else if (d.feriado) {
          feriadosIncluidos.push(d.feriado)
        }
      }
      if (valido && feriadosIncluidos.length > 0) {
        fines.push({
          cantidadDias: intervalo.length,
          primerDia: intervalo[0].date,
          ultimoDia: intervalo[intervalo.length - 1].date,
          feriados: feriadosIncluidos,
        })
      }
    }
  }
  const unicos = new Map()
  for (const f of fines) {
    const key = f.primerDia.toISOString() + '_' + f.ultimoDia.toISOString()
    if (!unicos.has(key)) {
      unicos.set(key, f)
    }
  }
  return Array.from(unicos.values())
}

export interface LongWeekend {
  cantidadDias: number
  primerDia: Date
  ultimoDia: Date
  feriados: Holiday[]
}

export function calcularFinesDeSemanaLargosConDiasLibres(
  feriados: Holiday[],
  diasLibres: number,
): LongWeekend[] {
  const year =
    feriados.length > 0 ? parseISO(feriados[0].date).getFullYear() : new Date().getFullYear()
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  const dias: { date: Date; feriado?: Holiday }[] = []
  eachDayOfInterval({ start, end }).forEach((d) => {
    const feriado = feriados.find((f) => f.date === format(d, 'yyyy-MM-dd'))
    dias.push({ date: d, feriado })
  })

  const fines: LongWeekend[] = []
  let i = 0
  while (i < dias.length) {
    const d = dias[i]
    if (isSaturday(d.date)) {
      let last = i
      let feriadosIncluidos: Holiday[] = []
      let diasLibresUsados = 0
      while (
        last < dias.length &&
        (isSunday(dias[last].date) ||
          isSaturday(dias[last].date) ||
          dias[last].feriado ||
          (diasLibresUsados < diasLibres &&
            (isMonday(dias[last].date) || isFriday(dias[last].date))))
      ) {
        if (!dias[last].feriado && (isMonday(dias[last].date) || isFriday(dias[last].date))) {
          diasLibresUsados++
        }
        if (dias[last].feriado) feriadosIncluidos.push(dias[last].feriado as Holiday)
        last++
      }
      if (last - i > 2 && feriadosIncluidos.length > 0) {
        fines.push({
          cantidadDias: last - i,
          primerDia: dias[i].date,
          ultimoDia: dias[last - 1].date,
          feriados: feriadosIncluidos,
        })
        i = last
        continue
      }
    }
    i++
  }
  return fines
}
