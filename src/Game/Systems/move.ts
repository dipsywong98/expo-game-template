import {System} from "../../Engine";

export const move: System = (entities, {events}) => {
  const movingEntities = events.filter(({type}) => type === 'move')
  movingEntities.forEach((event) => {
    const entity = entities[event.id]
    if (event.downPositions) {
      entity.x = event.positions.pageX - event.downPositions.locationX
      entity.y = event.positions.pageY - event.downPositions.locationY
    }
  })
  return entities
}
