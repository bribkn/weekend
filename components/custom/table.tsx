import { LongWeekend } from '@/domain/date'
import { formatFechaPalabras } from '@/utils/date'
import { format } from 'date-fns'

interface TablaFinesDeSemanaLargosProps {
  fines: LongWeekend[]
  mostrarCantidadDias?: boolean
  proximo?: LongWeekend | null
}

export const TablaFinesDeSemanaLargos = ({
  fines,
  mostrarCantidadDias = true,
  proximo = null,
}: TablaFinesDeSemanaLargosProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm border-collapse">
      <thead>
        <tr className="bg-muted">
          {mostrarCantidadDias && (
            <th className="px-4 py-2 text-left font-semibold">Cantidad de días</th>
          )}
          <th className="px-4 py-2 text-left font-semibold">Primer día</th>
          <th className="px-4 py-2 text-left font-semibold">Último día</th>
          <th className="px-4 py-2 text-left font-semibold">Feriados</th>
        </tr>
      </thead>
      <tbody>
        {fines.map((f, i) => {
          const esProximo =
            proximo &&
            f.primerDia.getTime() === proximo.primerDia.getTime() &&
            f.ultimoDia.getTime() === proximo.ultimoDia.getTime()
          return (
            <tr
              key={i}
              className={
                'border-b last:border-b-0 align-top' +
                (esProximo ? ' bg-gray-100 text-black font-semibold rounded-3xl' : '')
              }
            >
              {mostrarCantidadDias && (
                <td className="px-4 py-2 whitespace-normal break-words">{f.cantidadDias}</td>
              )}
              <td className="px-4 py-2 whitespace-normal break-words">
                {formatFechaPalabras(format(f.primerDia, 'yyyy-MM-dd'))}
              </td>
              <td className="px-4 py-2 whitespace-normal break-words">
                {formatFechaPalabras(format(f.ultimoDia, 'yyyy-MM-dd'))}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {f.feriados.map((h) => h.title).join(', ')}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
