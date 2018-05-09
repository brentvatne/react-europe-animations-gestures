import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { GestureHandler } from 'expo';
const {
  RotationGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} = GestureHandler;

export default class Gestures extends React.Component {
  panX = new Animated.Value(0);
  panY = new Animated.Value(0);
  scale = new Animated.Value(1);
  rotation = new Animated.Value(0);
  baseScale = new Animated.Value(1);
  _lastScale = 1;

  render() {
    const { panX, panY, scale, baseScale, rotation } = this;
    let actualScale = Animated.multiply(scale, baseScale);
    let rotate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0rad', '1rad'],
    });

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <RotationGestureHandler
          id="rotate"
          onGestureEvent={Animated.event([{ nativeEvent: { rotation } }])}
          onHandlerStateChange={this._handleRotationGestureStateChange}>
          <PinchGestureHandler
            id="pinch"
            simultaneousHandlers={['rotate']}
            onGestureEvent={Animated.event([{ nativeEvent: { scale } }])}
            onHandlerStateChange={this._handlePinchGestureStateChange}>
            <PanGestureHandler
              simultaneousHandlers={['pinch', 'rotate']}
              onGestureEvent={Animated.event([
                { nativeEvent: { translationX: panX, translationY: panY } },
              ])}
              onHandlerStateChange={this._handlePanGestureStateChange}>
              <Animated.View
                style={[
                  styles.box,
                  {
                    transform: [
                      { scale: actualScale },
                      { rotate },
                      { translateX: panX },
                      { translateY: panY },
                    ],
                  },
                ]}
              />
            </PanGestureHandler>
          </PinchGestureHandler>
        </RotationGestureHandler>
      </View>
    );
  }

  _handlePinchGestureStateChange = e => {
    const { oldState, scale } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      this._lastScale = this._lastScale * scale;
      this.baseScale.setValue(this._lastScale);
      this.scale.setValue(1);
    }
  };

  _handleRotationGestureStateChange = e => {
    const { oldState } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      this.rotation.extractOffset();
    }
  };

  _handlePanGestureStateChange = e => {
    const { oldState } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      // This adds the value to the current offset, then sets the value to 0
      this.panX.extractOffset();
      this.panY.extractOffset();

      if (true /* some condition based on gesture values*/) {
        // do something
      } else {
        // do something else
      }
    }
  };
}

const styles = StyleSheet.create({
  box: {
    width: 150,
    height: 150,
    backgroundColor: 'red',
  },
});
