import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { Holiday } from '@/domain/date'

interface HolidaysResponse {
  status: string
  data: Holiday[]
}

export function useHolidays() {
  return useQuery<Holiday[], Error>({
    queryKey: ['holidays'],
    queryFn: async () => {
      const res = await axios.get<HolidaysResponse>('https://api.boostr.cl/holidays.json', {
        headers: { accept: 'application/json' },
      })
      return res.data.data
    },
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
  })
}
