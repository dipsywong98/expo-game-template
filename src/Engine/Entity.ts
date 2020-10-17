import { ComponentType, FunctionComponent } from 'react'
import { InteractiveProps } from './makeInteractive'
import { ContainerProps } from './Container'

export interface Entity<T = unknown> {
  x: number
  y: number
  style?: Record<string, unknown>
  Component: ComponentType<InteractiveProps> | FunctionComponent<ContainerProps> | T
  [key: string]: unknown
}
