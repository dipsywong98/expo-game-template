import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Engine} from "./src/Engine/Engine";
import Vertex from "./src/Game/Entities/Vertex";
import {move} from "./src/Game/Systems/move";
import Container from "./src/Engine/Container";

export default function App() {
  const [running, setRunning] = useState(true)
  const log = (text: string) => () => console.log(text)
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title={(running ? 'pause' : 'running')} onPress={() => setRunning(!running)}/>
      <Engine entities={{
        1: {x: 50, y: 50, style: {backgroundColor: 'black'}, Component: Vertex},
        2: {x: 200, y: 200, style:{width: '100px', height: '100px', backgroundColor: 'pink'}, Component: Container}
      }} systems={[move]} running={running}/>
      <View
        style={{width: '100px', height: '100px', backgroundColor: 'pink'}}
        onClick={log('click')}
        onPress={log('press')}
        onTouchStart={log('t st')}
        onTouchMove={log('t mv')}
        onTouchEnd={log('t end')}
        onMouseDown={log('mouse down')}
        onMouseMove={log('mouse move')}
        onMouseUp={log('mouse up')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
