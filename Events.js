import React from 'react';
import {
  Animated,
  Button,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { ScreenOrientation } from 'expo';

export default class Events extends React.Component {
  scrollY = new Animated.Value(0);

  componentDidMount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    let currentStatusBar = 'default';
    this.scrollY.addListener(({ value }) => {
      if (value >= 140 && currentStatusBar === 'default') {
        currentStatusBar = 'light-content';
        StatusBar.setBarStyle(currentStatusBar, true);
      } else if (value < 140 && currentStatusBar === 'light-content') {
        currentStatusBar = 'default';
        StatusBar.setBarStyle(currentStatusBar, true);
      }
    });
  }

  _renderScrollViewContent() {
    const data = Array.from({ length: 30 });
    return (
      <View style={styles.scrollViewContent}>
        {data.map((_, i) => (
          <View key={i} style={styles.row}>
            <Text>{i}</Text>
          </View>
        ))}
      </View>
    );
  }

  _blockJS = () => {
    let start = new Date();
    let end = new Date();
    while (end - start < 3000) {
      end = new Date();
    }
  };

  render() {
    let opacity = this.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.fill}>
        <Animated.ScrollView
          style={styles.fill}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true }
          )}>
          <View style={styles.staticTitle}>
            <Text style={{ fontSize: 28 }}>Title!</Text>
          </View>

          {this._renderScrollViewContent()}
        </Animated.ScrollView>
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

        <Animated.View style={[styles.absoluteTitle, { opacity }]}>
          <Text style={{ fontSize: 18, color: '#fff' }}>Title!</Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticTitle: {
    paddingTop: 50,
    paddingLeft: 15,
    paddingBottom: 20,
  },
  absoluteTitle: {
    paddingTop: 30,
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
