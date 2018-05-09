import React from 'react';
import { Animated, Button, StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

export default class Gestures extends React.Component {
  panX = new Animated.Value(0);
  panY = new Animated.Value(0);

  render() {
    const { panX, panY } = this;

    return (
      <View style={{ flex: 1 }}>
        <GravityArea />
        <PanGestureHandler
          onGestureEvent={Animated.event(
            [{ nativeEvent: { translationX: panX, translationY: panY } }],
            { useNativeDriver: true }
          )}
          onHandlerStateChange={this._handlePanGestureStateChange}>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{ translateX: panX }, { translateY: panY }],
              },
            ]}
          />
        </PanGestureHandler>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          <Button title="Block JS" onPress={this._blockJS} />
        </View>
      </View>
    );
  }

  // Object {
  //   "handlerTag": 1,
  //   "oldState": 4,
  //   "state": 5,
  //   "target": 7,
  //   "translationX": -132,
  //   "translationY": -201.5,
  //   "velocityX": -995.6449774168494,
  //   "velocityY": -831.3507824628867,
  //   "x": 72.5,
  //   "y": 225,
  // }
  //
  // GestureHandler State:
  //
  // State.UNDETERMINED - default and initial state
  // State.FAILED - handler failed recognition of the gesture
  // State.BEGAN - handler has initiated recognition but have not enough data to tell if it has recognized or not
  // State.CANCELLED - handler has been cancelled because of other handler (or a system) stealing the touch stream
  // State.ACTIVE - handler has recognized
  // State.END - gesture has completed
  _handlePanGestureStateChange = e => {
    console.log(e.nativeEvent);
    const { oldState, absoluteX, absoluteY } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      // This adds the value to the current offset, then sets the value to 0
      this.panX.extractOffset();
      this.panY.extractOffset();

      if (absoluteX < 200 && absoluteY < 200) {
        this.panX.flattenOffset();
        this.panY.flattenOffset();
        Animated.spring(this.panX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(this.panY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  _blockJS = () => {
    let start = new Date();
    let end = new Date();
    while (end - start < 3000) {
      end = new Date();
    }
  };
}

const GravityArea = () => (
  <View
    style={{
      width: 200,
      height: 200,
      borderWidth: 1,
      borderColor: '#888',
      backgroundColor: '#eee',
      position: 'absolute',
    }}
  />
);

const styles = StyleSheet.create({
  box: {
    width: 80,
    height: 80,
    backgroundColor: 'red',
  },
});
