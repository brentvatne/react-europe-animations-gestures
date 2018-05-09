import React from 'react';
import {
  Animated,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import {
  ScrollView,
  TapGestureHandler,
  LongPressGestureHandler,
  RectButton,
  BorderlessButton,
  BaseButton,
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { Icon } from 'expo';

const stateToPropMappings = {
  [State.BEGAN]: 'BEGAN',
  [State.FAILED]: 'FAILED',
  [State.CANCELLED]: 'CANCELLED',
  [State.ACTIVE]: 'ACTIVE',
  [State.END]: 'END',
};

class TapHandlerExamples extends React.Component {
  tapValue = new Animated.Value(1);
  longPressValue = new Animated.Value(1);

  render() {
    let { tapValue, longPressValue } = this;
    let longPressBackgroundColor = longPressValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['red', '#eee'],
    });

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center', paddingTop: 30 }}>
        <TapGestureHandler
          numberOfTaps={1}
          onHandlerStateChange={this._handleTapStateChange}
          shouldCancelWhenOutside>
          <Animated.View style={[styles.button, { opacity: tapValue }]}>
            <Text>Tap</Text>
          </Animated.View>
        </TapGestureHandler>

        <LongPressGestureHandler
          onHandlerStateChange={this._handleLongPressStateChange}>
          <Animated.View
            style={[
              styles.button,
              { backgroundColor: longPressBackgroundColor },
            ]}>
            <Text>Long press</Text>
          </Animated.View>
        </LongPressGestureHandler>

        {/* <TapGestureHandler
          onHandlerStateChange={this._handleTapStateChange}
          shouldCancelWhenOutside>
          <LongPressGestureHandler
            onHandlerStateChange={this._handleLongPressStateChange}>
            <Animated.View
              style={[
                styles.button,
                {
                  opacity: tapValue,
                  backgroundColor: longPressBackgroundColor,
                },
              ]}>
              <Text>Tap or long press</Text>
            </Animated.View>
          </LongPressGestureHandler>
        </TapGestureHandler> */}

        <RectButton style={styles.button} onPress={() => alert('press')}>
          <Text>RectButton</Text>
        </RectButton>

        <BorderlessButton onPress={() => alert('press')}>
          <Text>BorderlessButton</Text>
        </BorderlessButton>
      </ScrollView>
    );
  }

  _handleTapStateChange = ({ nativeEvent }) => {
    let { oldState, state } = nativeEvent;
    console.log({ tap: stateToPropMappings[state] });

    if (state === State.BEGAN) {
      Animated.spring(this.tapValue, { toValue: 0.5 }).start();
    } else if (
      oldState === State.ACTIVE ||
      (oldState === State.BEGAN && state !== State.ACTIVE)
    ) {
      Animated.spring(this.tapValue, { toValue: 1 }).start();
    } else if (state === State.ACTIVE) {
      alert('tap');
    }
  };

  _handleLongPressStateChange = ({ nativeEvent }) => {
    let { oldState, state } = nativeEvent;
    console.log({ longPress: stateToPropMappings[state] });

    if (state === State.ACTIVE) {
      Animated.spring(this.longPressValue, { toValue: 0 }).start();
      alert('long press');
    } else if (oldState === State.ACTIVE) {
      Animated.spring(this.longPressValue, { toValue: 1 }).start();
    }
  };
}

class PanGestureHandlerExample extends React.Component {
  panX = new Animated.Value(0);
  panY = new Animated.Value(0);

  render() {
    const { panX, panY } = this;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
      </View>
    );
  }

  _handlePanGestureStateChange = e => {
    console.log(e.nativeEvent);
    const { oldState } = e.nativeEvent;

    // Add the value to the current offset, then set the value to 0
    if (oldState === State.ACTIVE) {
      this.panX.extractOffset();
      this.panY.extractOffset();
    }
  };
}

class RotationGestureHandlerExample extends React.Component {
  rotation = new Animated.Value(0);

  render() {
    let rotate = this.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0rad', '1rad'],
    });

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <RotationGestureHandler
          onGestureEvent={Animated.event(
            [{ nativeEvent: { rotation: this.rotation } }],
            { useNativeDriver: true }
          )}
          onHandlerStateChange={this._handlePanGestureStateChange}>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{ rotate }],
              },
            ]}
          />
        </RotationGestureHandler>
      </View>
    );
  }

  _handlePanGestureStateChange = e => {
    console.log(e.nativeEvent);
    const { oldState } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      this.rotation.extractOffset();
    }
  };
}

class PinchGestureHandlerExample extends React.Component {
  currentScale = new Animated.Value(1);
  accumulatedScale = new Animated.Value(1);
  _lastScale = 1;

  render() {
    let scale = Animated.multiply(this.currentScale, this.accumulatedScale);

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <PinchGestureHandler
          onGestureEvent={Animated.event(
            [{ nativeEvent: { scale: this.currentScale } }],
            { useNativeDriver: true }
          )}
          onHandlerStateChange={this._handlePanGestureStateChange}>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{ scale }],
              },
            ]}
          />
        </PinchGestureHandler>
      </View>
    );
  }

  _handlePanGestureStateChange = e => {
    console.log(e.nativeEvent);
    const { oldState, scale } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      this._lastScale = this._lastScale * scale;
      this.accumulatedScale.setValue(this._lastScale);
      this.currentScale.setValue(1);
    }
  };
}

const Icons = {
  Tap: 'gesture-double-tap',
  Pan: 'cursor-move',
  Rotation: 'format-rotate-90',
  Pinch: 'arrow-expand',
};

export default createStackNavigator(
  {
    Gestures: createBottomTabNavigator(
      {
        Tap: TapHandlerExamples,
        Pan: PanGestureHandlerExample,
        Rotation: RotationGestureHandlerExample,
        Pinch: PinchGestureHandlerExample,
      },
      {
        tabBarOptions: {
          activeTintColor: 'red',
          inactiveTintColor: '#ccc',
        },
        navigationOptions: ({ navigation }) => {
          let { routeName } = navigation.state;
          let iconName = Icons[routeName];

          return {
            tabBarIcon: ({ focused }) => {
              return (
                <Icon.MaterialCommunityIcons
                  name={iconName}
                  size={25}
                  color={focused ? 'red' : '#ccc'}
                />
              );
            },
          };
        },
      }
    ),
  },
  {
    cardStyle: {
      backgroundColor: '#fff',
    },
    navigationOptions: {
      title: 'Gesture Examples',
    },
  }
);

const styles = StyleSheet.create({
  box: {
    width: 150,
    height: 150,
    backgroundColor: 'red',
  },
  button: {
    backgroundColor: '#eee',
    marginBottom: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
