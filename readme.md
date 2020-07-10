# expo-game-template

> A Web+Android+iOS game boilerplate in expo react native

Inherit all yarn commands from expo

Inspired by [react-native-game-engine](https://github.com/bberak/react-native-game-engine)

## Start development

```shell script
yarn # install the dependencies
expo start # start the expo development server
# then you can start android, ios, or web whatever you like 
```
## Web deployment

```shell script
expo build:web # static files at web-build
```

## Usage

```jsx
import React, {useMemo, useState} from 'react'
import {Engine} from './Engine'
() => {
const [running, setRunning] = useState(true)
const entities = useMemo(() => ({
1: {x: 50, y: 50, style: {backgroundColor: 'black'}, Component: Vertex},
2: {x: 200, y: 200, style:{width: 100, height: 100, backgroundColor: 'pink'}, Component: Container}
/* other entities */
}), [])
return <Engine entities={entities} systems={[move, /* other systems */]} running={running}/>
}
```

### Engine

The stage that all entities are in and interactions happened

### Entities

An object that maps entity id to entity definition, which consist of x, y, Component,
 and other props that will pass to the component.
 
Component need to have Container as root or wrapped by `makeInteractive`

```tsx
import Container, {ContainerProps, ContainerPropTypes} from "../../Engine/Container";
import React, {FunctionComponent} from "react";
import PropTypes from 'prop-types'

const Vertex: FunctionComponent<ContainerProps&{style?: object}> = ({style, ...props}) => {
  return <Container {...props} style={{
    width: 16,
    height: 16,
    backgroundColor: 'pink',
    ...style
  }}/>
}

Vertex.propTypes = {
  ...ContainerPropTypes,
  style: PropTypes.object
}

export default Vertex

```

```tsx
import React, {FunctionComponent} from 'react'
import {View} from 'react-native'
import {elementPropTypes, InteractiveProps, interactivePropTypes, makeInteractive} from './makeInteractive'
import PropTypes from 'prop-types'

const _Container = ({ x = 0, y = 0, style={}, ...props }) => <View
  style={{
    position: 'absolute',
    left: x,
    top: y,
    ...style
  }}
  {...props}
/>

_Container.propTypes = {
  ...elementPropTypes,
  x: PropTypes.number,
  y: PropTypes.number
}


export const ContainerPropTypes = {
  ...interactivePropTypes,
  x: PropTypes.number,
  y: PropTypes.number,
  style: PropTypes.object
};
export type ContainerProps = PropTypes.InferProps<typeof ContainerPropTypes> | InteractiveProps;
const Container: FunctionComponent<ContainerProps> = makeInteractive(_Container);
Container.propTypes = ContainerPropTypes

export default Container
```

### System

A system is a function that is called automatically for every animation frame
(the period is system determined, so it is dynamic),
and called in the sequence that it is passed to the engine.
A system will accept entities from the previous frame or entities returned by previous system as first parameter,
and second parameter is the object `{events, currentMs, deltaMs}`, and it should return new entities.

```ts
import {System} from './Engine'

export const move: System = (entities, {events, currentMs, deltaMs}) => {
  const movingEntities = events.filter(({type}) => type === 'move')
  movingEntities.forEach((event) => {
    const entity = entities[event.id]
    if(event.startPositions){
      entity.x = event.positions.pageX - event.startPositions.locationX
      entity.y =  event.positions.pageY - event.startPositions.locationY
    }
  })
  return entities
}
```

### InteractEvent

A list of event is passed to each of the systems

```ts
interface InteractEvent {
  id: string | number // entity id
  type: InteractType // 'down' | 'move' | 'up'
  event: SyntheticEvent // the native event
  positions: Positions, // global and local position
  startPositions?: Positions  // global and local position of previous down event
  startTime?: number // time that previous down event occur
}

interface Positions {
  // global position
  pageX: number
  pageY: number

  // local position
  locationX: number
  locationY: number
}
```

`down` is the event of mouse down or touch start
`up` is the event of mouse up or touch end
`move` is the event of mouse move while mouse down or touch move
