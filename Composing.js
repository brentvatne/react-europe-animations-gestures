import React from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';

let BLUE = '#00288f';
let RED = '#db3f41';

export default class App extends React.Component {
  progress = new Animated.Value(0);
  state = {
    value: 0,
    looping: false,
  };

  componentDidMount() {
    this.progress.addListener(({ value }) => {
      this.setState({ value });
    });
  }

  _startLoop = () => {
    this.setState({ looping: true }, () => {
      Animated.loop(
        Animated.sequence([
          Animated.spring(this.progress, { toValue: 0 }),
          Animated.spring(this.progress, { toValue: 1, bounciness: 20 }),
          Animated.spring(this.progress, { toValue: 2 }),
        ])
      ).start();
    });
  };

  _stopLoop = () => {
    this.setState({ looping: false }, () => {
      this.progress.stopAnimation();
    });
  };

  render() {
    let rotate = this.progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['0deg', '180deg', '360deg'],
    });

    let scale = this.progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0.5, 1, 0.5],
    });

    let backgroundColor = this.progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [BLUE, RED, BLUE],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            { backgroundColor, transform: [{ rotate }, { scale }] },
            styles.box,
          ]}
        />
        {this.state.looping ? (
          <Button title="Stop" onPress={this._stopLoop} />
        ) : (
          <Button title="Loop" onPress={this._startLoop} />
        )}
        <Text>{this.state.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
});
