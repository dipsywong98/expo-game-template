import React, { FunctionComponent, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Engine } from './src/Engine'
import Vertex from './src/Game/Entities/Vertex'
import { move } from './src/Game/Systems/move'
import Container from './src/Engine/Container'

const App: FunctionComponent = () => {
  const [running, setRunning] = useState(true)
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title={(running ? 'pause' : 'resume')} onPress={() => setRunning(!running)}/>
      <Engine
        entities={{
          1: { x: 50, y: 50, style: { backgroundColor: 'black' }, Component: Vertex },
          2: { x: 200, y: 200, style: { width: 100, height: 100, backgroundColor: 'pink' }, Component: Container }
        }}
        systems={[move]}
        running={running}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default App
