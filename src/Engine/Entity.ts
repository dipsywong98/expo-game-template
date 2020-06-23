import {ComponentType} from 'react'
import {InteractiveProps} from "./makeInteractive";

export interface Entity {
  x: number
  y: number
  Component: ComponentType<InteractiveProps>
}
