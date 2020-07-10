import {Platform} from 'react-native'
import React, {ComponentType, FunctionComponent, SyntheticEvent, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useEngineContext} from "./EngineContex";

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
  onTouchEnd: PropTypes.func,
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
  event: SyntheticEvent
  positions: Positions
  startPositions?: Positions
  startTime?: number
}

export type ElementProps = PropTypes.InferProps<typeof elementPropTypes>

export interface InteractiveProps {
  id: string | number
  onInteract?: (event: InteractEvent) => unknown
}

export const makeInteractive = (Element: ComponentType<ElementProps>): FunctionComponent<InteractiveProps> => {
  return (props: InteractiveProps) => {
    const {onInteract, id, ...otherProps} = props
    const [startPositions, setStartPositions] = useState<Positions|undefined>(undefined)
    const [startTime_, setStartTime] = useState<number|undefined>(undefined)
    const {timer} = useEngineContext()
    const buildEvent = (type: InteractType, event: any): InteractEvent => {
      const positions = {
        // @ts-ignore
        pageX: event.nativeEvent.pageX,
        // @ts-ignore
        pageY: event.nativeEvent.pageY,
        // @ts-ignore
        locationX: event.nativeEvent.locationX || event.nativeEvent.offsetX || 0,
        // @ts-ignore
        locationY: event.nativeEvent.locationY || event.nativeEvent.offsetY || 0,
      }

      const now = timer.now()
      const start  = type === 'down' ? positions : startPositions
      if(type === 'up'){
        setStartPositions(undefined)
        setStartTime(undefined)
      }
      if(type === 'down'){
        setStartPositions(positions)
        setStartTime(now)
      }
      const startTime = type === 'down' ? now : startTime_

      return ({
        id,
        type,
        event,
        positions,
        startPositions: start,
        startTime
      })
    }
    if (Platform.OS !== 'web') {
      return <Element
        onTouchStart={event => onInteract?.(buildEvent('down', event))}
        onTouchMove={event => onInteract?.(buildEvent('move', event))}
        onTouchEnd={event => onInteract?.(buildEvent('up', event))}
        {...props}
      />
    } else {
      const [mouseDown, setMouseDown] = useState(false)
      const handleMouseDown = (event: SyntheticEvent) => {
        setMouseDown(true)
        onInteract?.(buildEvent('down', event))
      }
      // const handleMouseMove = (event: SyntheticEvent) => {
      //   // console.log(event.nativeEvent)
      //   if (mouseDown) {
      //     onInteract?.(buildEvent('move', event))
      //   }
      // }
      const handleMouseUp = (event: SyntheticEvent) => {
        if (mouseDown) {
          setMouseDown(false)
          onInteract?.(buildEvent('up', event))
        }
      }
      const handleTouchEnd = (event: SyntheticEvent) => {
        event.preventDefault()
        onInteract?.(buildEvent('up', event))
      }
      useEffect(() => {
        const mouseUpListener = (event: MouseEvent) => {
          if (mouseDown) {
            setMouseDown(false)
            onInteract?.(buildEvent('up', {
              nativeEvent: event
            }))
          }
        };
        const mouseMoveListener = (event: MouseEvent) => {
          if (mouseDown) {
            onInteract?.(buildEvent('move', {
              nativeEvent: event
            }))
          }
        };
        window.addEventListener('mouseup', mouseUpListener)
        window.addEventListener('mousemove', mouseMoveListener)
        return () => {
          window.removeEventListener('mouseup', mouseUpListener)
          window.removeEventListener('mousemove', mouseMoveListener)
        }
      }, [handleMouseUp])
      return <Element
        {...otherProps}
        onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // onMouseLeave={handleMouseUp}
        onTouchStart={event => onInteract?.(buildEvent('down', event))}
        onTouchMove={event => onInteract?.(buildEvent('move', event))}
        onTouchEnd={handleTouchEnd}
      />
    }
  }
}
