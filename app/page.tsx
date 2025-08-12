'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CalendarDays, Calculator } from 'lucide-react'
import { useState } from 'react'
import { useHolidays } from '@/network/holidays'
import { calcularFinesDeSemanaLargos, formatFechaPalabras, LongWeekend } from '@/utils/date'

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

export default function Home() {
  const [diasLaborales, setDiasLaborales] = useState(1)
  const { data, isLoading, error } = useHolidays()
  const [showLaboral, setShowLaboral] = useState(false)
  const [mostrarPasados, setMostrarPasados] = useState(false)

  const hoy = new Date()
  let finesNormales = Array.isArray(data) ? calcularFinesDeSemanaLargos(data) : []

  if (!mostrarPasados) {
    finesNormales = finesNormales.filter((f) => f.ultimoDia >= hoy)
  }

  const proximoNormal =
    finesNormales.length > 0
      ? finesNormales.reduce((a, b) => (a.primerDia < b.primerDia ? a : b))
      : null

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto md:py-10">
      <div className="flex justify-center items-center gap-4 mb-6">
        <CalendarDays
          className={`size-8 ${!showLaboral ? 'text-primary' : 'text-muted-foreground'}`}
        />
        <Switch
          checked={showLaboral}
          onCheckedChange={setShowLaboral}
          aria-label="Cambiar vista"
          className="w-14 h-8"
        />
        <Calculator
          className={`size-8 ${showLaboral ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </div>
      <div className="relative min-h-[350px]">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${showLaboral ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Card>
            <CardHeader>
              <CardTitle>Fines de semana largos</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Switch
                  checked={mostrarPasados}
                  onCheckedChange={setMostrarPasados}
                  aria-label="Mostrar fechas pasadas"
                />
                <span className="text-sm text-muted-foreground select-none">
                  Mostrar feriados pasados
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-muted-foreground">Cargando feriados...</div>}
              {error && <div className="text-destructive">Error al cargar feriados</div>}
              <TablaFinesDeSemanaLargos
                fines={finesNormales}
                mostrarCantidadDias={false}
                proximo={proximoNormal}
              />
            </CardContent>
          </Card>
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${showLaboral ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Card>
            <CardHeader>
              <CardTitle>Simula tus días libres</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Switch
                  checked={mostrarPasados}
                  onCheckedChange={setMostrarPasados}
                  aria-label="Mostrar fechas pasadas"
                />
                <span className="text-sm text-muted-foreground select-none">
                  Mostrar feriados pasados
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>¿Cuántos días libres puedes pedir?</Label>
                <div className="grid grid-cols-5 gap-2 w-full max-w-xs">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      key={n}
                      variant={diasLaborales === n ? 'default' : 'outline'}
                      onClick={() => setDiasLaborales(n)}
                      className={diasLaborales === n ? '' : 'bg-background'}
                      style={{ minWidth: 0 }}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>
              {isLoading && <div className="text-muted-foreground">Cargando feriados...</div>}
              {error && <div className="text-destructive">Error al cargar feriados</div>}
              <TablaFinesDeSemanaLargos
                fines={finesNormales}
                mostrarCantidadDias={true}
                proximo={proximoNormal}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
