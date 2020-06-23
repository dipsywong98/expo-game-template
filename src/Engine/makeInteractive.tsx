import {Platform} from 'react-native'
import React, {ComponentType, FunctionComponent, SyntheticEvent, useState} from 'react'
import PropTypes from 'prop-types'

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

export type InteractType = 'down' | 'move' | 'up' | 'press'

export interface InteractEvent {
  id: string | number
  type: InteractType
  event: SyntheticEvent
  positions: {
    pageX: number
    pageY: number
    locationX: number
    locationY: number
  }
}

export type ElementProps = PropTypes.InferProps<typeof elementPropTypes>

export interface InteractiveProps {
  id: string | number
  onInteract?: (event: InteractEvent) => unknown
}

export const makeInteractive = (Element: ComponentType<ElementProps>): FunctionComponent<InteractiveProps> => {
  return (props: InteractiveProps) => {
    const {onInteract, id, ...otherProps} = props
    const buildEvent = (type: InteractType, event: SyntheticEvent): InteractEvent => ({
      id,
      type,
      event,
      positions: {
        // @ts-ignore
        pageX: event.nativeEvent.pageX,
        // @ts-ignore
        pageY: event.nativeEvent.pageY,
        // @ts-ignore
        locationX: event.nativeEvent.locationX,
        // @ts-ignore
        locationY: event.nativeEvent.locationY,
      }
    })
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
      const handleMouseMove = (event: SyntheticEvent) => {
        if (mouseDown) {
          onInteract?.(buildEvent('move', event))
        }
      }
      const handleMouseUp = (event: SyntheticEvent) => {
        if(mouseDown) {
          setMouseDown(false)
          onInteract?.(buildEvent('up', event))
        }
      }
      const handleTouchEnd = (event: SyntheticEvent) => {
        event.preventDefault()
        onInteract?.(buildEvent('up', event))
      }
      return <Element
        {...otherProps}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={event => onInteract?.(buildEvent('down', event))}
        onTouchMove={event => onInteract?.(buildEvent('move', event))}
        onTouchEnd={handleTouchEnd}
      />
    }
  }
}
