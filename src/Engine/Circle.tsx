import Container, { ContainerProps, ContainerPropTypes } from './Container'
import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  ...ContainerPropTypes,
  radius: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  color: PropTypes.string
}

const Circle: FunctionComponent<ContainerProps & PropTypes.InferProps<typeof propTypes>> = ({ style, radius, backgroundColor, color, ...props }) => (
  <Container
    {...props}
    style={{
      width: radius,
      height: radius,
      borderRadius: '50%',
      backgroundColor,
      color,
      ...style
    }}
  />
)

Circle.propTypes = propTypes

export default Circle
