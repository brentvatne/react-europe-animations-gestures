import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

let BLUE = '#00288f';
let WHITE = '#fff';
let RED = '#db3f41';

export default class App extends React.Component {
  blueValue = new Animated.Value(0);
  whiteValue = new Animated.Value(0);
  redValue = new Animated.Value(0);

  componentDidMount() {
    Animated.spring(this.whiteValue, {
      toValue: this.blueValue,
      speed: 2,
    }).start();
    Animated.spring(this.redValue, {
      toValue: this.whiteValue,
      speed: 2,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.spring(this.blueValue, { toValue: 1 }),
        Animated.delay(1000),
        Animated.spring(this.blueValue, { toValue: 0 }),
      ])
    ).start();
  }

  render() {
    let interpolationConfig = {
      inputRange: [0, 1],
      outputRange: [10, Dimensions.get('window').width - 70 - 10],
    };

    let blueTranslateX = this.blueValue.interpolate(interpolationConfig);
    let whiteTranslateX = this.whiteValue.interpolate(interpolationConfig);
    let redTranslateX = this.redValue.interpolate(interpolationConfig);

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            {
              backgroundColor: BLUE,
              transform: [{ translateX: blueTranslateX }],
            },
            styles.box,
          ]}
        />
        <Animated.View
          style={[
            {
              backgroundColor: WHITE,
              transform: [{ translateX: whiteTranslateX }],
            },
            styles.box,
          ]}
        />
        <Animated.View
          style={[
            {
              backgroundColor: RED,
              transform: [{ translateX: redTranslateX }],
            },
            styles.box,
          ]}
        />
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
    position: 'absolute',
    width: 70,
    height: 70,
    borderWidth: 1,
  },
});
