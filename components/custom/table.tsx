import { LongWeekend } from '@/domain/date'
import { formatDateWords } from '@/utils/date'
import { format } from 'date-fns'
import { useMemo } from 'react'

interface WeekendTableProps {
  weekends: LongWeekend[]
  showQuantity?: boolean
  today: Date
}

export const WeekendTable = ({ weekends, showQuantity = true, today }: WeekendTableProps) => {
  const proximo = useMemo(() => {
    return weekends.find((f) => f.firstDay > today)
  }, [weekends, today])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted">
            {showQuantity && <th className="px-4 py-2 text-left font-semibold">Cantidad de días</th>}
            <th className="px-4 py-2 text-left font-semibold">Primer día</th>
            <th className="px-4 py-2 text-left font-semibold">Último día</th>
            <th className="px-4 py-2 text-left font-semibold">Feriados</th>
          </tr>
        </thead>
        <tbody>
          {weekends.map((w, i) => {
            const esProximo = proximo && w.firstDay.getTime() === proximo.firstDay.getTime() && w.lastDay.getTime() === proximo.lastDay.getTime()
            return (
              <tr key={i} className={'border-b last:border-b-0 align-top' + (esProximo ? ' bg-gray-100 text-black font-semibold rounded-3xl' : '')}>
                {showQuantity && <td className="px-4 py-2 whitespace-normal break-words">{w.quantity}</td>}
                <td className="px-4 py-2 whitespace-normal break-words">{formatDateWords(format(w.firstDay, 'yyyy-MM-dd'))}</td>
                <td className="px-4 py-2 whitespace-normal break-words">{formatDateWords(format(w.lastDay, 'yyyy-MM-dd'))}</td>
                <td className="px-4 py-2 whitespace-nowrap">{w.holidays.map((h) => h.title).join(', ')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
