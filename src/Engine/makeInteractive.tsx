import { GestureResponderEvent, Platform } from 'react-native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useEngineContext } from './EngineContex'

export const interactivePropTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onInteract: PropTypes.func
}

export const elementPropTypes = {
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func
}

export interface ElementProps {
  onMouseDown?: (event: GestureResponderEvent) => void
  onMouseMove?: (event: GestureResponderEvent) => void
  onMouseUp?: (event: GestureResponderEvent) => void
  onTouchStart?: (event: GestureResponderEvent) => void
  onTouchMove?: (event: GestureResponderEvent) => void
  onTouchEnd?: (event: GestureResponderEvent) => void
}

export type InteractType = 'down' | 'move' | 'up'

export interface Positions {
  pageX: number
  pageY: number
  locationX: number
  locationY: number
}

export interface InteractEvent {
  id: string | number
  type: InteractType
  event: GestureResponderEvent
  positions: Positions
  startPositions?: Positions
  startTime?: number
}

export interface InteractiveProps {
  id: string | number
  onInteract?: (event: InteractEvent) => unknown
}

interface NativeEvent {
  pageX?: number
  pageY?: number
  locationX?: number
  locationY?: number
  offsetX?: number
  offsetY?: number
}

export function makeInteractive <T> (Element: FunctionComponent<ElementProps & T>): FunctionComponent<InteractiveProps> {
  return (props: InteractiveProps) => {
    const { onInteract, id, ...otherProps } = props
    const [startPositions, setStartPositions] = useState<Positions | undefined>(undefined)
    const [startTime_, setStartTime] = useState<number | undefined>(undefined)
    const { timer } = useEngineContext()
    const buildEvent = (type: InteractType, event: {
      nativeEvent: NativeEvent
    }): InteractEvent => {
      if (event.nativeEvent.pageX === undefined || event.nativeEvent.pageY === undefined) {
        console.warn('missing pageX and pageY in event')
      }
      const positions: Positions = {
        pageX: event.nativeEvent.pageX ?? 0,
        pageY: event.nativeEvent.pageY ?? 0,
        locationX: event.nativeEvent.locationX ?? event.nativeEvent.offsetX ?? 0,
        locationY: event.nativeEvent.locationY ?? event.nativeEvent.offsetY ?? 0
      }

      const now = timer.now()
      const start = type === 'down' ? positions : startPositions
      if (type === 'up') {
        setStartPositions(undefined)
        setStartTime(undefined)
      }
      if (type === 'down') {
        setStartPositions(positions)
        setStartTime(now)
      }
      const startTime = type === 'down' ? now : startTime_

      return ({
        id,
        type,
        event: event as unknown as GestureResponderEvent,
        positions,
        startPositions: start,
        startTime
      })
    }
    if (Platform.OS !== 'web') {
      return (
        <Element
          onTouchStart={event => onInteract?.(buildEvent('down', event))}
          onTouchMove={event => onInteract?.(buildEvent('move', event))}
          onTouchEnd={event => onInteract?.(buildEvent('up', event))}
          {...props}
        />
      )
    } else {
      const [mouseDown, setMouseDown] = useState(false)
      const handleMouseDown = (event: GestureResponderEvent): void => {
        setMouseDown(true)
        onInteract?.(buildEvent('down', event))
      }
      // const handleMouseMove = (event: SyntheticEvent) => {
      //   // console.log(event.nativeEvent)
      //   if (mouseDown) {
      //     onInteract?.(buildEvent('move', event))
      //   }
      // }
      const handleMouseUp = (event: GestureResponderEvent): void => {
        if (mouseDown) {
          setMouseDown(false)
          onInteract?.(buildEvent('up', event))
        }
      }
      const handleTouchEnd = (event: GestureResponderEvent): void => {
        event.preventDefault?.()
        onInteract?.(buildEvent('up', event))
      }
      useEffect(() => {
        const mouseUpListener = (event: MouseEvent): void => {
          if (mouseDown) {
            setMouseDown(false)
            onInteract?.(buildEvent('up', {
              nativeEvent: event
            }))
          }
        }
        const mouseMoveListener = (event: MouseEvent): void => {
          if (mouseDown) {
            onInteract?.(buildEvent('move', {
              nativeEvent: event
            }))
          }
        }
        window.addEventListener('mouseup', mouseUpListener)
        window.addEventListener('mousemove', mouseMoveListener)
        return () => {
          window.removeEventListener('mouseup', mouseUpListener)
          window.removeEventListener('mousemove', mouseMoveListener)
        }
      }, [handleMouseUp])
      return (
        <Element
          {...otherProps}
          onMouseDown={handleMouseDown}
          // onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          // onMouseLeave={handleMouseUp}
          onTouchStart={event => onInteract?.(buildEvent('down', event))}
          onTouchMove={event => onInteract?.(buildEvent('move', event))}
          onTouchEnd={handleTouchEnd}
        />
      )
    }
  }
}
