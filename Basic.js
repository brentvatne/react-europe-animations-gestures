import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

let BLUE = '#00288f';
let WHITE = '#fff';
let RED = '#db3f41';

export default class App extends React.Component {
  progress = new Animated.Value(0);
  state = {
    value: 0,
  };

  componentDidMount() {
    setTimeout(() => {
      Animated.timing(this.progress, { toValue: 1, duration: 10000 }).start();
    }, 1000);

    this.progress.addListener(({ value }) => {
      this.setState({ value });
    });
  }

  render() {
    let rotate = this.progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    let translateX = this.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 500],
    });

    let backgroundColor = this.progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [BLUE, WHITE, RED],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            { backgroundColor, transform: [{ translateX }, { rotate }] },
            styles.box,
          ]}
        />
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
  },
  box: {
    width: 70,
    height: 70,
    borderWidth: 1,
  },
});
