import React, {FunctionComponent} from 'react'
import {View} from 'react-native'
import {elementPropTypes, InteractiveProps, interactivePropTypes, makeInteractive} from './makeInteractive'
import PropTypes from 'prop-types'

const _Container = ({ x = 0, y = 0, style={}, ...props }) => <View
  style={{
    position: 'absolute',
    left: x + 'px',
    top: y + 'px',
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
