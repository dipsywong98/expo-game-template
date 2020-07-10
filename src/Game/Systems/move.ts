import {System} from "../../Engine";

export const move: System = (entities, {events}) => {
  const movingEntities = events.filter(({type}) => type === 'move')
  movingEntities.forEach((event) => {
    const entity = entities[event.id]
    if (event.startPositions) {
      entity.x = event.positions.pageX - event.startPositions.locationX
      entity.y = event.positions.pageY - event.startPositions.locationY
    }
  })
  return entities
}
