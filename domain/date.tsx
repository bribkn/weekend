export interface Holiday {
  date: string
  title: string
  type: string
  inalienable: boolean
  extra: string
}

export interface LongWeekend {
  cantidadDias: number
  primerDia: Date
  ultimoDia: Date
  feriados: Holiday[]
}
