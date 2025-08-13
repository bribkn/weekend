export interface Holiday {
  date: string
  title: string
  type: string
  inalienable: boolean
  extra: string
}

export interface LongWeekend {
  quantity: number
  firstDay: Date
  lastDay: Date
  holidays: Holiday[]
}
