import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import {
  ElementProps,
  elementPropTypes,
  InteractiveProps,
  interactivePropTypes,
  makeInteractive
} from './makeInteractive'
import PropTypes from 'prop-types'

const propTypes = {
  ...elementPropTypes,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  style: PropTypes.object
}

const _Container: FunctionComponent<ElementProps & PropTypes.InferProps<typeof propTypes>> = ({ x = 0, y = 0, style = {}, ...props }) => (
  <View
    style={{
      position: 'absolute',
      left: x,
      top: y,
      ...style
    }}
    {...props}
  />
)
_Container.propTypes = propTypes

export const ContainerPropTypes = {
  ...interactivePropTypes,
  x: PropTypes.number,
  y: PropTypes.number,
  style: PropTypes.object
}
export type ContainerProps = PropTypes.InferProps<typeof ContainerPropTypes> & InteractiveProps & ElementProps
const Container: FunctionComponent<ContainerProps> = makeInteractive(_Container)
Container.propTypes = ContainerPropTypes

export default Container
