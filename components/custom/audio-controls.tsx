'use client'
import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, PartyPopper, Sparkles, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioControls() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSlider, setShowSlider] = useState(false)
  const [showToasty, setShowToasty] = useState(false)

  useEffect(() => {
    if (!isPlaying) return
    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout
    const trigger = () => {
      setShowToasty(true)
      timeout = setTimeout(() => setShowToasty(false), 2000)
    }
    trigger()
    interval = setInterval(trigger, 10000)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
      setShowToasty(false)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handlePause)
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handlePause)
    }
  }, [])

  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  const handleVolumeClick = () => {
    setShowSlider((v) => !v)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
  }

  return (
    <>
      <AnimatePresence>
        {isPlaying && (
          <>
            <AnimatePresence>
              {showToasty && (
                <motion.img
                  key="toasty-weeknd"
                  src="/weeknd.png"
                  alt="Toasty Weeknd"
                  className="fixed -bottom-5 -right-5 w-32 h-32 z-[10001] pointer-events-none select-none"
                  initial={{ x: 200, opacity: 0, rotate: -45 }}
                  animate={{ x: 0, opacity: 1, rotate: -45 }}
                  exit={{ x: 200, opacity: 0, rotate: -45 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.5 }}
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
                />
              )}
            </AnimatePresence>
            <motion.div
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.img
                  key={i}
                  src="/penguin.gif"
                  alt="Penguin Party"
                  className="w-24 h-24 mx-2"
                  initial={{ y: 40, scale: 0.8, opacity: 0 }}
                  animate={{ y: [40, -10, 0, 10, 0], scale: [0.8, 1.1, 1, 1.1, 1], opacity: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.2,
                  }}
                  style={{ zIndex: 10000 }}
                />
              ))}
            </motion.div>
            <motion.div
              className="fixed inset-0 pointer-events-none z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 360,
                    scale: 0.7 + Math.random() * 0.6,
                    opacity: 0.7 + Math.random() * 0.3,
                  }}
                  animate={{
                    y: -100,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1.5,
                    delay: Math.random() * 0.7,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  style={{ position: 'absolute', left: 0, top: 0 }}
                >
                  {i % 3 === 0 ? (
                    <PartyPopper className="text-pink-500" />
                  ) : i % 3 === 1 ? (
                    <Sparkles className="text-yellow-400" />
                  ) : (
                    <Star className="text-blue-400" />
                  )}
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="fixed left-0 top-0 h-full w-10 pointer-events-none z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: -40,
                    y: Math.random() * window.innerHeight,
                    rotate: Math.random() * 360,
                    scale: 0.7 + Math.random() * 0.6,
                    opacity: 0.7 + Math.random() * 0.3,
                  }}
                  animate={{
                    x: 60,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1.5,
                    delay: Math.random() * 0.7,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  style={{ position: 'absolute', top: 0 }}
                >
                  {i % 2 === 0 ? (
                    <PartyPopper className="text-pink-400" />
                  ) : (
                    <Sparkles className="text-yellow-300" />
                  )}
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="fixed right-0 top-0 h-full w-10 pointer-events-none z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 40,
                    y: Math.random() * window.innerHeight,
                    rotate: Math.random() * 360,
                    scale: 0.7 + Math.random() * 0.6,
                    opacity: 0.7 + Math.random() * 0.3,
                  }}
                  animate={{
                    x: -60,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1.5,
                    delay: Math.random() * 0.7,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  style={{ position: 'absolute', top: 0 }}
                >
                  {i % 2 === 0 ? (
                    <PartyPopper className="text-pink-400" />
                  ) : (
                    <Sparkles className="text-yellow-300" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="fixed bottom-3 md:bottom-3 left-3 md:left-6 flex gap-2 z-50 items-center">
        <button
          type="button"
          aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
          onClick={handlePlayPause}
          className="rounded-full bg-primary text-primary-foreground p-2 shadow hover:bg-primary/80 transition"
        >
          {isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
        </button>
        <div className="relative">
          <button
            type="button"
            aria-label="Controlar volumen"
            onClick={handleVolumeClick}
            className="rounded-full bg-primary text-primary-foreground p-2 shadow hover:bg-primary/80 transition"
          >
            <Volume2 className={`size-6 ${volume === 0 ? 'opacity-40' : ''}`} />
          </button>
          {showSlider && (
            <div className="absolute left-12 bottom-2 flex items-center bg-background rounded px-2 py-1 shadow border">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleSliderChange}
                className="w-24 accent-primary"
              />
            </div>
          )}
        </div>
        <audio ref={audioRef} src="/the-weekend.mp3" preload="auto" />
      </div>
    </>
  )
}
