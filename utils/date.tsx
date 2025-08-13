import { addDays, isWithinInterval, isSameDay, isBefore, isAfter, isWeekend } from 'date-fns'

import { Holiday } from '@/domain/date'
import { format, parseISO, isSaturday, isSunday, isFriday, isMonday, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { LongWeekend } from '@/domain/date'

export const formatDateWords = (dateStr: string) => {
  try {
    const date = parseISO(dateStr)
    return format(date, "EEEE, dd 'de' MMMM", { locale: es }).replace(/^([a-záéíóúüñ])/i, (c) => c.toUpperCase())
  } catch {
    return dateStr
  }
}

export function calculateLongWeekends(holidays: Holiday[]): LongWeekend[] {
  if (holidays.length === 0) return []
  const year = parseISO(holidays[0].date).getFullYear()
  const holidayDatesSet = new Set(holidays.map((h) => h.date))
  const days: { date: Date; holiday?: Holiday }[] = []
  holidays.forEach((h) => {
    const d = parseISO(h.date)
    days.push({ date: d, holiday: h })
  })
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  eachDayOfInterval({ start, end }).forEach((d) => {
    const dateStr = format(d, 'yyyy-MM-dd')
    if (!holidayDatesSet.has(dateStr)) {
      days.push({ date: d })
    }
  })
  days.sort((a, b) => a.date.getTime() - b.date.getTime())

  const weekends: LongWeekend[] = []
  for (let i = 0; i < days.length; i++) {
    for (let j = i + 2; j < days.length; j++) {
      if (days[j].date.getFullYear() !== year) break
      const interval = days.slice(i, j + 1)
      const hasSaturday = interval.some((d) => isSaturday(d.date))
      const hasSunday = interval.some((d) => isSunday(d.date))
      if (!hasSaturday || !hasSunday) continue
      let valid = true
      const includedHolidays: Holiday[] = []
      for (const d of interval) {
        if (!isSaturday(d.date) && !isSunday(d.date)) {
          if (!d.holiday) {
            valid = false
            break
          } else {
            includedHolidays.push(d.holiday)
          }
        } else if (d.holiday) {
          includedHolidays.push(d.holiday)
        }
      }
      if (valid && includedHolidays.length > 0) {
        weekends.push({
          quantity: interval.length,
          firstDay: interval[0].date,
          lastDay: interval[interval.length - 1].date,
          holidays: includedHolidays,
        })
      }
    }
  }
  const uniques = new Map()
  for (const w of weekends) {
    const key = w.firstDay.toISOString() + '_' + w.lastDay.toISOString()
    if (!uniques.has(key)) {
      uniques.set(key, w)
    }
  }
  return Array.from(uniques.values())
}

export interface LongWeekendWithRequestedDays extends LongWeekend {
  requestedDays: Date[]
}

export function calculateLongWeekendsWithRequestedDays(
  holidays: Holiday[],
  maxRequestedDays = 4,
  maxConsecutiveDays = 9,
  minFreeDays = 4,
): LongWeekendWithRequestedDays[] {
  if (holidays.length === 0) return []
  const holidaysSet = new Set(holidays.map((h) => format(parseISO(h.date), 'yyyy-MM-dd')))
  const results: LongWeekendWithRequestedDays[] = []
  holidays.forEach((holiday) => {
    const holidayDate = parseISO(holiday.date)
    for (let blockLen = minFreeDays; blockLen <= maxConsecutiveDays; blockLen++) {
      for (let offset = -(blockLen - 1); offset <= 0; offset++) {
        const start = addDays(holidayDate, offset)
        const block = Array.from({ length: blockLen }, (_, i) => addDays(start, i))
        if (!block.some((d) => isSameDay(d, holidayDate))) continue
        if (!block.some((d) => isSaturday(d)) || !block.some((d) => isSunday(d))) continue
        const holidaysInBlock = block.filter((d) => holidaysSet.has(format(d, 'yyyy-MM-dd')))
        const workingDaysInBlock = block.filter((d) => !isWeekend(d) && !holidaysSet.has(format(d, 'yyyy-MM-dd')))
        for (let req = 1; req <= Math.min(maxRequestedDays, workingDaysInBlock.length); req++) {
          const combinations = getCombinations(workingDaysInBlock, req)
          for (const requestedDays of combinations) {
            const free = new Set(block.filter((d) => isWeekend(d) || holidaysSet.has(format(d, 'yyyy-MM-dd')) || requestedDays.some((p) => isSameDay(p, d))))
            if (free.size === block.length && holidaysInBlock.length > 0 && block.length >= minFreeDays) {
              results.push({
                quantity: block.length,
                firstDay: block[0],
                lastDay: block[block.length - 1],
                holidays: holidaysInBlock.map((d) => holidays.find((h) => isSameDay(parseISO(h.date), d))!).filter(Boolean),
                requestedDays,
              })
            }
          }
        }
      }
    }
  })
  // Remove duplicates by date range and requested days
  const uniques = new Map()
  for (const r of results) {
    const key = r.firstDay.toISOString() + '_' + r.lastDay.toISOString() + '_' + r.requestedDays.map((d) => d.toISOString()).join(',')
    if (!uniques.has(key)) {
      uniques.set(key, r)
    }
  }
  return Array.from(uniques.values())
}

// Utility to get all combinations of k elements from an array
function getCombinations<T>(arr: T[], k: number): T[][] {
  const res: T[][] = []
  function backtrack(start: number, path: T[]) {
    if (path.length === k) {
      res.push([...path])
      return
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i])
      backtrack(i + 1, path)
      path.pop()
    }
  }
  backtrack(0, [])
  return res
}
