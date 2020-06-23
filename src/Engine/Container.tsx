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


const propTypes = {
  ...interactivePropTypes,
  x: PropTypes.number,
  y: PropTypes.number,
  style: PropTypes.object
};
const Container: FunctionComponent<PropTypes.InferProps<typeof propTypes>|InteractiveProps> = makeInteractive(_Container);
Container.propTypes = propTypes

export default Container
