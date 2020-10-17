import Container, { ContainerProps, ContainerPropTypes } from './Container'
import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  ...ContainerPropTypes,
  lineWidth: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  backgroundColor: PropTypes.number
}

const Line: FunctionComponent<ContainerProps & PropTypes.InferProps<typeof propTypes>> = ({ style, width, height, backgroundColor, color, ...props }) => {
  return (
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
}

Line.propTypes = propTypes

export default Line
