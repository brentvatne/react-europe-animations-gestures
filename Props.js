import React from 'react';
import { Animated, Text, View } from 'react-native';

class MyComponent extends React.Component {
  state = {
    customAnimatedPropValue: 0,
  };

  setNativeProps(props) {
    this.setState({ customAnimatedPropValue: props.customAnimatedProp });
  }

  render() {
    return <Text>{this.state.customAnimatedPropValue}</Text>;
  }
}

class MyOtherComponent extends React.Component {
  render() {
    return <Text>{this.props.customAnimatedProp}</Text>;
  }
}

const MyComponentAnimated = Animated.createAnimatedComponent(MyComponent);
const MyOtherComponentAnimated = Animated.createAnimatedComponent(
  MyOtherComponent
);

export default class Props extends React.Component {
  value = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.value, { toValue: 100, duration: 10000 }).start();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MyComponentAnimated customAnimatedProp={this.value} />
        <MyOtherComponentAnimated customAnimatedProp={this.value} />
      </View>
    );
  }
}
