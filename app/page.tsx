'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CalendarDays, Calculator, Calendar, ArrowDownWideNarrow } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useHolidays } from '@/network/holidays'
import { calculateLongWeekends, calculateLongWeekendsWithRequestedDays } from '@/utils/date'
import { WeekendTable } from '@/components/custom/table'

export default function Home() {
  const [laboralDays, setLaboralDays] = useState(1)
  const { data, isLoading, error } = useHolidays()
  const [showLaboral, setShowLaboral] = useState(false)
  const [showPastDays, setShowPastDays] = useState(false)
  const [order, setOrder] = useState<'fecha' | 'cantidad'>('fecha')

  const today = useMemo(() => new Date(), [])
  const holidays = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const futureHolidays = useMemo(() => holidays.filter((f) => new Date(f.date) >= today), [holidays, today])

  const normalWeekends = useMemo(() => calculateLongWeekends(holidays), [holidays])
  const futureWeekends = useMemo(() => calculateLongWeekends(futureHolidays), [futureHolidays])

  const filteredNormalWeekends = useMemo(() => (showPastDays ? normalWeekends : futureWeekends), [normalWeekends, futureWeekends, showPastDays])
  const allExtendedWeekends = useMemo(() => calculateLongWeekendsWithRequestedDays(holidays), [holidays])

  const filteredExtendedWeekends = useMemo(() => {
    const filtered = allExtendedWeekends.filter((f) => f.requestedDays.length === laboralDays && (showPastDays || f.lastDay >= today))
    if (order === 'cantidad') {
      return [...filtered].sort((a, b) => b.quantity - a.quantity)
    } else {
      return [...filtered].sort((a, b) => a.firstDay.getTime() - b.firstDay.getTime())
    }
  }, [allExtendedWeekends, laboralDays, showPastDays, today, order])

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="flex justify-center items-center gap-4">
        <CalendarDays className={`size-8 ${!showLaboral ? 'text-primary' : 'text-muted-foreground'}`} />
        <Switch checked={showLaboral} onCheckedChange={setShowLaboral} aria-label="Cambiar vista" className="w-14 h-8" />
        <Calculator className={`size-8 ${showLaboral ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <div className="relative min-h-[350px]">
        <div className={`absolute inset-0 transition-opacity duration-500 ${showLaboral ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Card>
            <CardHeader>
              <CardTitle>Fines de semana largos</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Switch checked={showPastDays} onCheckedChange={setShowPastDays} aria-label="Mostrar fechas pasadas" />
                <span className="text-sm text-muted-foreground select-none">Mostrar holidays pasados</span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-muted-foreground">Cargando holidays...</div>}
              {error && <div className="text-destructive">Error al cargar holidays</div>}
              <WeekendTable weekends={filteredNormalWeekends} showQuantity={false} today={today} />
            </CardContent>
          </Card>
        </div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${showLaboral ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Card>
            <CardHeader>
              <CardTitle>Simula tu nuevo fin de semana largo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>¿Cuántos días libres puedes pedir?</Label>
                <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
                  {[1, 2, 3, 4].map((n) => (
                    <Button
                      key={`btn-${n}`}
                      variant={laboralDays === n ? 'default' : 'outline'}
                      onClick={() => setLaboralDays(n)}
                      className={laboralDays === n ? '' : 'bg-background'}
                      style={{ minWidth: 0 }}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-2 sm:space-x-2 sm:space-y-0">
                <Button
                  variant={order === 'fecha' ? 'default' : 'outline'}
                  onClick={() => setOrder('fecha')}
                  aria-label="Ordenar por fecha"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Calendar className="size-5" />
                  <span className="text-xs">Ordenar por fecha</span>
                </Button>
                <Button
                  variant={order === 'cantidad' ? 'default' : 'outline'}
                  onClick={() => setOrder('cantidad')}
                  aria-label="Ordenar por cantidad de días libres"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <ArrowDownWideNarrow className="size-5" />
                  <span className="text-xs">Ordenar por cantidad de días libres</span>
                </Button>
              </div>
              {isLoading && <div className="text-muted-foreground">Cargando holidays...</div>}
              {error && <div className="text-destructive">Error al cargar holidays</div>}
              <WeekendTable weekends={filteredExtendedWeekends} showQuantity={true} today={today} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
