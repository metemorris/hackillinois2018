/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import MapView from "react-native-maps";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';
import {getDirections} from "./apis/maps";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      text:" Hello"
    };
  }

  destChange = ( dest )=>{
    this.setState({text:dest})
  }

  _route = () => {
      getDirections({lat: 41.43206, lng: -81.38992}, {lat: 41.53206, lng: -81.58992})
        .then((data) => console.log(JSON.stringify(data)))
  }

  render() {
    return (
      <View style={styles.container}>
          <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={{
                  latitude: 11,
                  longitude: 12,
                  latitudeDelta: 0.09,
                  longitudeDelta:0.09,
              }}
          />
          <TextInput 
            value = {this.state.text}
            onChangeText={this.destChange}
            style={{
              backgroundColor:"#fff",
              padding:15,
              width:100

            }}
          />
          <Button 
            title = {"Directions"}
            onPress = {this._route}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
