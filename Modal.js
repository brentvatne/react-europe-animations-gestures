import React from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';

class Modal extends React.Component {
  value = new Animated.Value(0);

  componentDidMount() {
    if (this.props.visible) {
      this._show();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible && !this.props.visible) {
      this._hide();
    } else if (!prevProps.visible && this.props.visible) {
      this._show();
    }
  }

  render() {
    return (
      <Animated.View
        pointerEvents={this.props.visible ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFill, { opacity: this.value }]}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.2)' },
          ]}
        />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {this.props.children(this.value)}
        </View>
      </Animated.View>
    );
  }

  _show = () => {
    Animated.spring(this.value, { toValue: 1, useNativeDriver: true }).start();
  };

  _hide = () => {
    Animated.spring(this.value, { toValue: 0, useNativeDriver: true }).start();
  };
}

export default class ModalExample extends React.Component {
  state = {
    isModalOpen: false,
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Open modal" onPress={this._openModal} />
        <Modal visible={this.state.isModalOpen}>
          {value => (
            <Animated.View
              style={[
                styles.content,
                {
                  transform: [
                    {
                      translateY: value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [200, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <Text>Hello from a modal!</Text>
              <Button title="Close modal" onPress={this._closeModal} />
            </Animated.View>
          )}
        </Modal>
      </View>
    );
  }

  _openModal = () => this.setState({ isModalOpen: true });
  _closeModal = () => this.setState({ isModalOpen: false });
}

const styles = StyleSheet.create({
  content: {
    minHeight: 150,
    minWidth: 200,
    padding: 20,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
});
