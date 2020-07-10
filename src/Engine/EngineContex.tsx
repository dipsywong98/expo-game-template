import {createContext, useContext} from "react";
import {Timer} from "./Timer";

export const EngineContext = createContext({
  timer: new Timer()
})

export const useEngineContext = () => useContext(EngineContext)
