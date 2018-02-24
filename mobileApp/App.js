/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import RNPlaces from 'react-native-google-places';
import MapView from "react-native-maps";
import uuid from "uuid/v4"
import heatView from "./web/heatView.html";

import {
  StyleSheet,
  Text,
    WebView,
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
        coords: [],
        latitude: 0,
        longitude: 0,
        uuid: "None"
    };
  }

  _generateHeatMap = () => {
      const uri = '../heatView.html';
      return <WebView
          pointerEvents="none"
          style={{opacity: 0.2}}
          source={heatView}
          scrollEnabled={false}
          javaScriptEnabled
      />;
  }

  destChange = (dest) =>{
    this.setState({text: dest})
  }

  _updateLocation = (loc, uuid) => {
      const body = {
          lat: loc.lat,
          lng: loc.lng,
          uuid: uuid
      }
      return fetch("https://hackil18.herokuapp.com/update", {
          body: JSON.stringify(body),
          method: 'POST'
      }).catch((err) => console.log(err))
  }

  componentWillMount() {
      this.setState({uuid: uuid()});
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this._updateLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        }, this.state.uuid);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 20 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  getDestLatLong = () => ({
      lat: this.state.dest.latitude,
      lng: this.state.dest.longitude,
  })

  _route = () => {
      getDirections({lat: this.state.latitude, lng:this.state.longitude}, this.getDestLatLong())
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
              region={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.11,
              }}>
              <MapView.Polyline
                  coordinates={this.state.coords}
                  strokeWidth={2}
                  strokeColor="red"/>
          </MapView>
          <View pointerEvents="none" style={{position:"absolute", width: "100%", height: "100%"}}>
              {this._generateHeatMap()}
          </View>
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
                  onPress = {this._route}/>
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
