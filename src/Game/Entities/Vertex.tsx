import Container from "../../Engine/Container";
import React, {FunctionComponent} from "react";


const Vertex: FunctionComponent = ({style, ...props}) => {
  return <Container {...props} style={{
    width: '16px',
    height: '16px',
    backgroundColor: 'pink',
    ...style
  }}/>
}

export default Vertex
