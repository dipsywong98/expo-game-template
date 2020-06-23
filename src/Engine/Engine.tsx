import React, {Component} from 'react'
import Container from './Container'
import {Timer} from './Timer'
import {Entity} from "./Entity";
import PropTypes from 'prop-types'
import {EngineContext} from './EngineContex';
import {InteractEvent} from "./makeInteractive";

const propTypes = {
  entities: PropTypes.object,
  systems: PropTypes.array,
  timer: PropTypes.object
}

export type Entities = { [id: string]: Entity }

export interface SystemStates {
  events: Array<InteractEvent>,
  currentMs: number,
  deltaMs: number
}

export type System = (entities: Entities, states: SystemStates) => Entities

interface Props {
  entities?: Entities
  systems?: Array<System>
  timer?: Timer
  running?: boolean
}

export class Engine extends React.Component<Props> {
  systems: Array<System>
  timer: Timer
  state: { entities: Entities } = {entities: {}}
  events: Array<InteractEvent> = []
  prevMs: number = 0

  constructor(props: Props) {
    super(props);
    this.state.entities = props.entities || {}
    this.systems = props.systems ?? []
    this.timer = new Timer()
    this.timer.subscribe(this.timerHandler)
    // this.timer.start()
  }

  timerHandler = (currentMs: number) => {
    const states: SystemStates = {
      events: this.events,
      currentMs,
      deltaMs: currentMs - this.prevMs
    }
    // console.log(entities)
    const newEntities = this.systems.reduce((prev, system) => system(prev, states), this.state.entities)
    // console.log(newEntities)
    this.events = []
    this.setState({entities: newEntities})
    this.timer?.stop()
    this.prevMs = currentMs
  }

  handleInteraction = (event: InteractEvent) => {
    this.events.push(event)
  }

  componentWillReceiveProps = (nextProps: Readonly<Props>) => {
    if (nextProps.running !== false) {
      this.timer.stop()
    } else {
      if(this.props.running !== nextProps.running){
        this.events = []
      }
      this.timer.start()
    }
    console.log(nextProps.running)
  }

  render() {
    return <EngineContext.Provider value={null}>
      <Container id='root'>
        {Object.entries(this.state.entities).map(([id, {Component, ...props}]) => <Component key={id} id={id}
                                                                                             onInteract={this.handleInteraction } {...props}/>)}
      </Container>
    </EngineContext.Provider>
  }
}

Engine.propTypes
