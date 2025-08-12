import { PartyPopper } from 'lucide-react'

export default function Hero() {
  return (
    <section className="flex justify-center text-center">
      <div className="flex gap-3 pt-4 md:pt-12 items-center">
        <PartyPopper className="size-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight w-full">Fin de semana largos</h1>
      </div>
    </section>
  )
}
