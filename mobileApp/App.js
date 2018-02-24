/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import RNPlaces from 'react-native-google-places';
import MapView from "react-native-maps";
import {
  StyleSheet,
  Text,
    TouchableWithoutFeedback,
  View,
  TextInput,
  Button
} from 'react-native';
import {getDirections, getPolyLines} from "./apis/maps";

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        text:" Hello",
        coords: [],
    };
  }

  destChange = (dest) =>{
    this.setState({text:dest})
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
      getDirections({lat: 41.43206, lng: -81.38992}, this.getLatLong())
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
          <TouchableWithoutFeedback onPress={() => RNPlaces.openAutocompleteModal()}>
              <View
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
          </TouchableWithoutFeedback>
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
