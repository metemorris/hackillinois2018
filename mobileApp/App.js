/**
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import RNPlaces from 'react-native-google-places';
import MapView, {Marker} from "react-native-maps";
import uuid from "uuid/v4";
import heatView from "./web/heatView.html";
import locIcon from "./assets/loc2.png";

import {
  StyleSheet,
  Text,
    WebView,
    TouchableWithoutFeedback,
  View,
  Button,
  Switch,
  TouchableOpacity,
  Image
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

  _thrash = () => {
      alert("Trash alert sent");
      const body = {
        lat: this.state.latitude,
        lng: this.state.longitude,
        type: "trash"
        }
        return fetch("https://hackil18.herokuapp.com/updateIncident", {
        body: JSON.stringify(body),
        method: 'POST'
        }).catch((err) => console.log(err))
        
    }
    
  _roadwork = () => {
    alert("Construction alert sent");
    const body = {
      lat: this.state.latitude,
      lng: this.state.longitude,
      type: "construction"
      }
      return fetch("https://hackil18.herokuapp.com/updateIncident", {
      body: JSON.stringify(body),
      method: 'POST'
      }).catch((err) => console.log(err))
    }

  _event = () => {
        alert("Event alert sent");
        const body = {
        lat: this.state.latitude,
        lng: this.state.longitude,
        type: "event"
        }
        return fetch("https://hackil18.herokuapp.com/updateIncident", {
        body: JSON.stringify(body),
        method: 'POST'
        }).catch((err) => console.log(err))
    }

  _warning = () => {
        alert("Road warning alert sent");
        const body = {
        lat: this.state.latitude,
        lng: this.state.longitude,
        type: "hazard"
        }
        return fetch("https://hackil18.herokuapp.com/updateIncident", {
        body: JSON.stringify(body),
        method: 'POST'
        }).catch((err) => console.log(err))
    }

  _help = () => {
      alert("Food alert sent");
    const body = {
      lat: this.state.latitude,
      lng: this.state.longitude,
      type: "food"
      }
      return fetch("https://hackil18.herokuapp.com/updateIncident", {
      body: JSON.stringify(body),
      method: 'POST'
      }).catch((err) => console.log(err))
    }
    
  _thief = () => {
        alert("Crime alert sent");
        const body = {
        lat: this.state.latitude,
        lng: this.state.longitude,
        type: "crime"
        }
        return fetch("https://hackil18.herokuapp.com/updateIncident", {
        body: JSON.stringify(body),
        method: 'POST'
        }).catch((err) => console.log(err))
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
                  latitudeDelta: 0.012,
                  longitudeDelta: 0.015,
              }}>
              <MapView.Polyline
                  coordinates={this.state.coords}
                  strokeWidth={2}
                  strokeColor="red"/>
              {
                  this.state.dest.latitude ?
                      <Marker
                          coordinate={{latitude: this.state.dest.latitude, longitude: this.state.dest.longitude}}
                          title={this.state.dest.name}
                          description={this.state.dest.description}
                      /> :
                      <View/>
              }
              <Marker
                  coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}
                  image={locIcon}
              />
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
                      width:"68%",
                      left:20,
                      bottom: "5%",
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


           <TouchableOpacity
                onPress = {this._route}
                style={{

                  bottom: "5%",
                  left: "75%",
                  justifyContent:"center",
                  alignItems:"center",
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  width:50,
                  height:50,
                  borderRadius: 100,
                    shadowColor: "#222",
                    shadowOpacity: 0.35,
                    shadowRadius: 5,
                    shadowOffset: {width: 1, height: 1}
                    
                
                }}
                onPress={this._route}>
                <Image
                    style={{
                        maxWidth:50,
                        resizeMode:"contain"
                    }}
                    source={require('./assets/arrow.png')}
                />
            </TouchableOpacity>
          <View 
              style={{
                  bottom: "80%",
                  left: "5%",
                  justifyContent:"center",
                  alignItems:"center",
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderRadius: 100
            }}>
                <TouchableOpacity
                onPress = {this._route}
                style={{
                    justifyContent: "center",
                    width:35,
                    height:35
                }}
                onPress={this._thrash}>
                <Image
                    style={{
                        maxWidth: 35,
                        maxHeight: 35,
                        resizeMode:"contain"
                    }
                    }
                    source={require('./assets/garbage.png')}
                />
                </TouchableOpacity>
          </View>
          <View 
              style={{
                  bottom: "70%",
                  left: "5%",
                  justifyContent:"center",
                  alignItems:"center",
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderRadius: 100
            }}>
                <TouchableOpacity
                onPress = {this._roadwork}
                style={{
                    justifyContent: "center",
                    width:35,
                    height:35
                }}
                onPress={this._roadwork}>
                <Image
                    style={{
                        maxWidth: 35,
                        maxHeight: 35,
                        resizeMode:"contain"
                    }}
                    source={require('./assets/hazard.png')}
                />
                </TouchableOpacity>
          </View>
          <View 
              style={{
                  bottom: "60%",
                  left: "5%",
                  justifyContent:"center",
                  alignItems:"center",
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderRadius: 100
            }}>
                <TouchableOpacity
                onPress = {this._event}
                style={{
                    justifyContent: "center",
                    width:35,
                    height:35
                }}
                onPress={this._event}>
                <Image
                    style={{
                        maxWidth: 35,
                        maxHeight: 35,
                        resizeMode:"contain"
                    }}
                    source={require('./assets/event.png')}
                />
                </TouchableOpacity>
          </View>

          <View 
              style={{
                  bottom: "50%",
                  left: "5%",
                  justifyContent:"center",
                  alignItems:"center",
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderRadius: 100
            }}>
                <TouchableOpacity
                onPress = {this._route}
                style={{
                    justifyContent: "center",
                    width:35,
                    height:35
                }}
                onPress={this._warning}>
                <Image
                    style={{
                        maxWidth: 35,
                        maxHeight: 35,
                        resizeMode:"contain"
                    }}
                    source={require('./assets/warning-sign.png')}
                />
                </TouchableOpacity>
          </View>

          <View 
              style={{
                  bottom: "40%",
                  left: "5%",
                  justifyContent:"center",
                  alignItems:"center",
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderRadius: 100
            }}>
                <TouchableOpacity
                onPress = {this._help}
                style={{
                    justifyContent: "center",
                    width:35,
                    height:35
                }}
                onPress={this._help}>
                <Image
                    style={{
                        maxWidth:35,
                        maxHeight: 35,
                        resizeMode:"contain"
                    }}
                    source={require('./assets/heart.png')}
                />
                </TouchableOpacity>
          </View>
          <View 
              style={{
                  bottom: "30%",
                  left: "5%",
                  justifyContent:"center",
                  alignItems:"center",
                  position: "absolute",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: "white",
                  borderRadius: 100
            }}>
                <TouchableOpacity
                onPress = {this._thief}
                style={{
                    justifyContent: "center",
                    width:35,
                    height:35
                }}
                onPress={this._thief}>
                <Image
                    style={{
                        maxWidth:35,
                        maxHeight: 35,
                        resizeMode:"contain"
                    }}
                    source={require('./assets/thief.png')}
                />
                </TouchableOpacity>
          </View>
          

          <View 
              style={{
                  bottom: "13%",
                  position: "absolute",
                  paddingHorizontal: 2,
                  paddingVertical: 2,
                  backgroundColor: "white",
                  borderRadius: 50
            }}>
                <Switch
                  title = {"Mete"}
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
