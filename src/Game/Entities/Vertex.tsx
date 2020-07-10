import Container, { ContainerProps, ContainerPropTypes } from '../../Engine/Container'
import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'

const Vertex: FunctionComponent<ContainerProps> = ({ style, ...props }) => {
  return (
    <Container
      {...props}
      style={{
        width: 16,
        height: 16,
        backgroundColor: 'pink',
        ...style
      }}
    />)
}

Vertex.propTypes = {
  ...ContainerPropTypes,
  style: PropTypes.object
}

export default Vertex
