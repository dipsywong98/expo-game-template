import Container, { ContainerProps, ContainerPropTypes } from './Container'
import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  ...ContainerPropTypes,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  color: PropTypes.string
}

const Rectangle: FunctionComponent<ContainerProps & PropTypes.InferProps<typeof propTypes>> = ({ style, width, height, backgroundColor, color, ...props }) => (
  <Container
    {...props}
    style={{
      width,
      height,
      backgroundColor,
      color,
      ...style
    }}
  />
)

Rectangle.propTypes = propTypes

export default Rectangle
