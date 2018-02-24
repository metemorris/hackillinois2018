/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import RNPlaces from 'react-native-google-places';
import MapView from "react-native-maps";
import uuid from "uuid/v5";

import {
  StyleSheet,
  Text,
    TouchableWithoutFeedback,
  View,
  Button
} from 'react-native';
import {getDirections, getPolyLines} from "./apis/maps";

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        dest: {name: "Enter Destination"},
        text:" Hello",
        coords: []
    };
  }

  destChange = (dest) =>{
    this.setState({text: dest})
  }

  getPosition = () =>{
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
  }

  getDestLatLong = () => ({
      lat: this.state.dest.latitude,
      lng: this.state.dest.longitude,
  })

  _route = () => {
      getDirections({lat: 41.7, lng: -87.3}, this.getDestLatLong())
        .then((data) => {
            console.log(data.routes);
            this.setState({coords: getPolyLines(data.routes)})
        })
  }

  _onAutocomplete = ()  => {
      RNPlaces.openAutocompleteModal()
          .then((data) => {
              console.log(JSON.stringify(data))
              this.setState({dest: data});
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
                  longitudeDelta: 0.81,
              }}>
              <MapView.Polyline
                  coordinates={this.state.coords}
                  strokeWidth={2}
                  strokeColor="red"/>
          </MapView>
          <TouchableWithoutFeedback onPress={this._onAutocomplete}>
              <View
                  style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      padding: 15,
                      width:"80%",
                      bottom: 75,
                      position: "absolute",
                      borderRadius: 15,
                      shadowColor: "#222",
                      shadowOpacity: 0.35,
                      shadowRadius: 5,
                      shadowOffset: {width: 1, height: 1}
                  }} >
                  <Text> {this.state.dest.name} </Text>
              </View>
          </TouchableWithoutFeedback>
          <View 
              style={{
                  bottom: 15,
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderRadius: 50
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
