import { createContext, useContext } from 'react'
import { Timer } from './Timer'

interface EngineContextType {
  timer: Timer
}

export const EngineContext = createContext({
  timer: new Timer()
})

export const useEngineContext = (): EngineContextType => useContext(EngineContext)
