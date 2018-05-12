import React from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

class Modal extends React.Component {
  value = new Animated.Value(0);
  translateY = new Animated.Value(0);

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
          <PanGestureHandler
            onHandlerStateChange={this._handlePanStateChange}
            onGestureEvent={Animated.event(
              [{ nativeEvent: { translationY: this.translateY } }],
              { useNativeDriver: true }
            )}
            enabled={this.props.visible}>
            <Animated.View
              style={{ transform: [{ translateY: this.translateY }] }}>
              {this.props.children}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Animated.View>
    );
  }

  _show = () => {
    this.translateY.setValue(0);
    Animated.spring(this.value, { toValue: 1, useNativeDriver: true }).start();
  };

  _hide = () => {
    Animated.spring(this.value, { toValue: 0, useNativeDriver: true }).start();
  };

  _handlePanEvent = ({ nativeEvent }) => {
    this.translateY.setValue(nativeEvent.translationY);
  };

  _handlePanStateChange = ({ nativeEvent }) => {
    let { oldState, state, velocityY, translationY } = nativeEvent;

    if (oldState === State.ACTIVE) {
      if (Math.abs(translationY) > 150 || Math.abs(velocityY) > 80) {
        let toValue;
        if (
          (translationY > 0 && velocityY >= 0) ||
          (translationY < 0 && velocityY > 0)
        ) {
          toValue = translationY + 300;
        } else {
          toValue = translationY - 300;
        }
        Animated.spring(this.translateY, {
          toValue,
          velocityY,
          useNativeDriver: true,
        }).start();
        this.props.onHide();
      } else {
        Animated.spring(this.translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
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

        <Modal visible={this.state.isModalOpen} onHide={this._closeModal}>
          <View style={styles.content}>
            <Text>Hello from a modal!</Text>
            <Button title="Close modal" onPress={this._closeModal} />
          </View>
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
