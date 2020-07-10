import React, { ReactNode } from 'react'
import Container from './Container'
import { Timer } from './Timer'
import { Entity } from './Entity'
import PropTypes from 'prop-types'
import { EngineContext } from './EngineContex'
import { InteractEvent } from './makeInteractive'

const propTypes = {
  entities: PropTypes.object,
  systems: PropTypes.array,
  timer: PropTypes.object
}

export interface Entities {
  [id: string]: Entity
}

export interface SystemStates {
  events: InteractEvent[]
  currentMs: number
  deltaMs: number
}

export type System = (entities: Entities, states: SystemStates) => Entities

interface Props {
  entities?: Entities
  systems?: System[]
  timer?: Timer
  running?: boolean
}

export class Engine extends React.Component<Props> {
  systems: System[]
  timer: Timer
  state: { entities: Entities } = { entities: {} }
  events: InteractEvent[] = []
  prevMs = 0
  static propTypes = propTypes

  constructor (props: Props) {
    super(props)
    this.state.entities = props.entities ?? {}
    this.systems = props.systems ?? []
    this.timer = new Timer()
    this.timer.subscribe(this.timerHandler)
    if (props.running === true) {
      this.timer.start()
    }
  }

  timerHandler = (currentMs: number): void => {
    const states: SystemStates = {
      events: this.events,
      currentMs,
      deltaMs: currentMs - this.prevMs
    }
    // console.log(entities)
    const newEntities = this.systems.reduce((prev, system) => system(prev, states), this.state.entities)
    // console.log(newEntities)
    this.events = []
    this.setState({ entities: newEntities })
    this.timer?.stop()
    this.prevMs = currentMs
  }

  handleInteraction = (event: InteractEvent): void => {
    this.events.push(event)
  }

  UNSAFE_componentWillReceiveProps = (nextProps: Readonly<Props>): void => {
    if (nextProps.running !== false) {
      if (this.props.running !== nextProps.running) {
        this.events = []
        this.timer.start()
      }
    } else {
      this.timer.stop()
    }
  }

  render (): ReactNode {
    return <EngineContext.Provider value={{ timer: this.timer }}>
      <Container id='root'>
        {Object.entries(this.state.entities)
          .map(([id, { Component, ...props }]) => (
            <Component
              key={id}
              id={id}
              onInteract={this.handleInteraction}
              {...props}
            />)
          )
        }
      </Container>
    </EngineContext.Provider>
  }
}
