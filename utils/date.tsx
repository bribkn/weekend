import { Holiday } from '@/domain/date'
import {
  format,
  parseISO,
  isSaturday,
  isSunday,
  isFriday,
  isMonday,
  eachDayOfInterval,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { LongWeekend } from '@/domain/date'

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
