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
import {getDirections, getPolyLines} from "./apis/maps";

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
        text:" Hello",
        coords: []
    };
  }

  destChange = (dest) =>{
    this.setState({text:dest})
  }
  getPosition = () =>{
    clat,clong;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          cLat: position.coords.latitude,
          cLong: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
    return {clat,clong};
  }
  getLatLong = () =>{
    //get lat and long of string 
    if(this.state.text == "Home"){
      return {lat: 41.53206, lng: -81.58992};
    }
    else{
      return {lat: 42.53206, lng: -84.58992}
    }
  }
  _route = () => {
      getDirections(this.getPosition, this.getLatLong())
        .then((data) => {
            console.log(data.routes);
            this.setState({coords: getPolyLines(data.routes)})
        })
  }

  render() {
    return (
      <View style={styles.container}>
          <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={{
                  latitude: 41.43206,
                  longitude: -81.38992,
                  latitudeDelta: 0.81,
                  longitudeDelta:0.81,
              }}>
              <MapView.Polyline
                  coordinates={this.state.coords}
                  strokeWidth={2}
                  strokeColor="red"/>
          </MapView>
          <TextInput 
            value = {this.state.text}
            onChangeText={this.destChange}
            style={{
              backgroundColor:"#fff",
              padding:15,
              width:"80%",
              bottom:60,
              position: "absolute",
              borderRadius:15,
              shadowColor: "#222",
              shadowOpacity: 0.35,
              shadowRadius: 5,
              shadowOffset: {width:1, height:1}

            }}
          />
          <View 
          style={{
              bottom:10,
              position:"absolute",
              paddingHorizontal:5,
              paddingVertical:5,
              backgroundColor:"white",
              borderRadius:50

            }}>
            <Button 
              title = {"Directions"}
              onPress = {this._route}
              
            />
          </View>
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
