import {System} from "../../Engine/Engine";

export const move: System = (entities, {events}) => {
  const movingEntities = events.filter(({type}) => type === 'touchMove').map(({id, event}) => [entities[id], event])
  movingEntities.forEach(([entity, event]) => {
    console.log(event)
    // entity.x
  })
  if(events.length)console.log(events.map(e => e.type))
  return entities
}
