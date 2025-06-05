import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const DURATION = 10 // segundos (ajustado)
const FPS = 1
const TICKS = DURATION * FPS

const blueTeam = [
  { name: 'Alice', image: '/blue1.png' },
  { name: 'Bob', image: '/blue2.png' },
  { name: 'Carol', image: '/blue3.png' }
]

const pinkTeam = [
  { name: 'Xena', image: '/pink1.png' },
  { name: 'Yara', image: '/pink2.png' },
  { name: 'Zara', image: '/pink3.png' }
]

export default function App() {
  const [blueRatio, setBlueRatio] = useState(0.5)
  const [highlighted, setHighlighted] = useState<{ side: 'blue' | 'pink'; index: number } | null>(null)
  const [isOver, setIsOver] = useState(false)
  const [winner, setWinner] = useState<'blue' | 'pink' | null>(null)

  const battleRef = useRef<HTMLAudioElement>(null)
  const victoryRef = useRef<HTMLAudioElement>(null)
  const rageRef = useRef<HTMLAudioElement>(null)

  function generateOscillation(): number[] {
    const result: number[] = []
    let current = 0.5
    for (let i = 0; i < TICKS - 2; i++) {
      const osc = (Math.sin(i / 3) + Math.random() - 0.5) * 0.04
      current += osc
      current = Math.max(0.1, Math.min(0.9, current))
      result.push(current)
    }
    // Nos últimos ticks, definir claramente o vencedor:
    // 1 para blue vencer, 0 para pink vencer
    result.push(0.45)
    result.push(1) // azul vence
    return result
  }

  useEffect(() => {
    const osc = generateOscillation()
    let i = 0

    battleRef.current?.play()

    const interval = setInterval(() => {
      setBlueRatio(osc[i])
      i++

      if (Math.random() < 0.4 && !highlighted) {
        const side = Math.random() < 0.5 ? 'blue' : 'pink'
        const index = Math.floor(Math.random() * 3)
        setHighlighted({ side, index })

        rageRef.current?.pause()
        rageRef.current!.currentTime = 0
        rageRef.current?.play()

        setTimeout(() => setHighlighted(null), 1000)
      }

      if (i >= TICKS) {
        clearInterval(interval)
        setIsOver(true)

        const finalWinner = osc[osc.length - 1] === 1 ? 'blue' : 'pink'
        setWinner(finalWinner)

        battleRef.current?.pause()
        battleRef.current!.currentTime = 0

        victoryRef.current?.play()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const showBlue = !isOver || winner === 'blue'
  const showPink = !isOver || winner === 'pink'
  const finalBlueWidth = isOver && winner === 'blue' ? '100%' : `${blueRatio * 100}%`
  const finalPinkWidth = isOver && winner === 'pink' ? '100%' : `${(1 - blueRatio) * 100}%`

  return (
    <>
      <audio ref={battleRef} src="../../trumpet-piano-viola-352621.mp3" loop />
      <audio ref={victoryRef} src="../../orchestral-win-331233.mp3" />
      <audio ref={rageRef} src="../../battle-screaming-36126.mp3" />

      <div className="w-screen h-screen flex overflow-hidden relative">
        <motion.div
          className={`h-full bg-blue-500 flex flex-col justify-center items-center transition-all duration-700 ${
            showBlue ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: finalBlueWidth }}
        >
          {blueTeam.map((person, index) => {
            const isActive = highlighted?.side === 'blue' && highlighted?.index === index
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center mb-2"
                animate={{ x: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className={`w-16 h-16 rounded-full border-4 ${
                    isActive ? 'border-yellow-400 scale-110 brightness-125' : 'border-white'
                  } transition-all duration-300`}
                />
                <span className="text-white mt-1">{person.name}</span>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className={`h-full bg-pink-400 flex flex-col justify-center items-center transition-all duration-700 ${
            showPink ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: finalPinkWidth }}
        >
          {pinkTeam.map((person, index) => {
            const isActive = highlighted?.side === 'pink' && highlighted?.index === index
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center mb-2"
                animate={{ x: [0, -10, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className={`w-16 h-16 rounded-full border-4 ${
                    isActive ? 'border-yellow-400 scale-110 brightness-125' : 'border-white'
                  } transition-all duration-300`}
                />
                <span className="text-white mt-1">{person.name}</span>
              </motion.div>
            )
          })}
        </motion.div>

        {isOver && winner && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white drop-shadow-lg bg-black bg-opacity-60 px-8 py-4 rounded-lg">
            {winner === 'blue' ? 'Equipe Azul venceu!' : 'Equipe Rosa venceu!'}
          </div>
        )}
      </div>
    </>
  )
}
