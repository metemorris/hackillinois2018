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
import constIcon from "./assets/hazardS.png";
import foodIcon from "./assets/heartS.png";
import eventIcon from "./assets/eventS.png";
import trashIcon from "./assets/garbageS.png";
import crimeIcon from "./assets/thiefS.png";
import hazardIcon from "./assets/warning-signS.png";


import {
  StyleSheet,
  Text,
    WebView,
    TouchableWithoutFeedback,
  View,
  Switch,
  TouchableOpacity,
  Image
} from 'react-native';
import {getDirections, getPolyLines} from "./apis/maps";
import {runHeatMap} from "./apis/heatmap";

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        dest: {name: "Enter Destination"},
        text:" Hello",
        coords: [],
        fcoords: [],
        fast: false,
        heatmap: [],
        myLat: 0,
        myLng: 0,
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.012,
        longitudeDelta: 0.015,
        incidents: [],
        uuid: "None"    
    };
  }

  _getHeatMapPoints = () => {
      const body = {
          lat: this.state.latitude,
          lng: this.state.longitude,
      }
      fetch("http://159.89.226.72/get/nearby", {
          body: JSON.stringify(body),
          method: 'POST'
      }).then((res)=> res.json())
          .then((res) => {
              console.log(res);
              this.setState({heatmap: res.nearby});
          })
          .catch((err) => console.log(err))
  }

  _generateHeatMap = () => {
      const script = runHeatMap(this.state.heatmap, this.state.latitude, this.state.longitude);
      return <WebView
                  pointerEvents="none"
                  style={{opacity: 0.2}}
                  source={heatView}
                  scrollEnabled={false}
                  injectedJavaScript={script}
                  javaScriptEnabled />;
  }

  _getIncidents = () => {
        const body = {
            lat: this.state.latitude,
            lng: this.state.longitude,
        }
        fetch("http://159.89.226.72/get/incident", {
            body: JSON.stringify([body]),
            method: 'POST'
        })
        .then((res)=> res.json())
        .then((res) => {
            console.log(res);
            this.setState({incidents: res.incidents});
        })
        .catch((err) => console.log(err))
  }

    _placeIncident = (incidents)=>{
        return incidents.map((incident, index)=>{
            switch(incident.type) {
                case "construction":
                return (
                    <Marker key={index}
                        coordinate={{latitude: incident.lat, longitude: incident.lng}}
                        image= {constIcon}
                    />);
                case "crime":
                    return (
                        <Marker key={index}
                            coordinate={{latitude: incident.lat, longitude: incident.lng}}
                            image={crimeIcon}
                        />);
                case "event":
                    return (
                        <Marker key={index}
                            coordinate={{latitude: incident.lat, longitude: incident.lng}}
                            image={eventIcon}
                            />);
                case "food":
                    return (
                        <Marker key={index}
                            coordinate={{latitude: incident.lat, longitude: incident.lng}}
                            image={foodIcon}
                        />);
                case "hazard":
                    return (
                        <Marker key={index}
                            coordinate={{latitude: incident.lat, longitude: incident.lng}}
                            image={hazardIcon}
                        />);
                case "trash":
                    return (
                        <Marker key={index}
                            coordinate={{latitude: incident.lat, longitude: incident.lng}}
                            image={trashIcon}
                        />);
                default:
                return (
                    <Marker key={index}
                        coordinate={{latitude: incident.lat, longitude: incident.lng}}
                        image={hazardIcon}
                    />);
            }
        });
    }

  _updateLocation = (loc, uuid) => {
      const body = {
          lat: loc.lat,
          lng: loc.lng,
          uuid: uuid
      }
      return fetch("http://159.89.226.72/update", {
          body: JSON.stringify(body),
          method: 'POST'
      }).catch((err) => console.log(err))
  }

  componentWillMount() {
      this.setState({uuid: uuid()});
  }

  componentDidMount() {
      let times = 0;
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this._updateLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        }, this.state.uuid);
        this._getIncidents();
        this._getHeatMapPoints();
        times += 1;
        this.setState({
            myLat: position.coords.latitude,
            myLng: position.coords.longitude,
            error: null,
        });
        if(times <= 2) {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }
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
      getDirections({lat: this.state.myLat, lng:this.state.myLng}, this.getDestLatLong())
        .then(({good, fast}) => {
            console.log(good.routes);
            getPolyLines(data.routes).then((data) => this.setState({coords: data}))
        })
  }

  _thrash = () => {
       alert("Contamination alert sent");
        const body = {
            lat: this.state.latitude,
            lng: this.state.longitude,
            type: "trash"
        }
        return fetch("http://159.89.226.72/updateIncident", {
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
      return fetch("http://159.89.226.72/updateIncident", {
      body: JSON.stringify(body),
      method: 'POST'
      }).catch((err) => console.log(err))
    }

  _event = () => {
        alert("Event alert sent");
        const body = {
            lat: this.state.myLat,
            lng: this.state.myLng,
            type: "event"
        }
        return fetch("http://159.89.226.72/updateIncident", {
        body: JSON.stringify(body),
        method: 'POST'
        }).catch((err) => console.log(err))
    }

  _warning = () => {
        alert("Caution alert sent");
        const body = {
            lat: this.state.myLat,
            lng: this.state.myLng,
            type: "hazard"
        }
        return fetch("http://159.89.226.72/updateIncident", {
        body: JSON.stringify(body),
        method: 'POST'
        }).catch((err) => console.log(err))
    }

    _help = () => {
      alert("Free common goods alert sent");
      const body = {
          lat: this.state.myLat,
          lng: this.state.myLng,
          type: "food"
      }
      return fetch("http://159.89.226.72/updateIncident", {
      body: JSON.stringify(body),
      method: 'POST'
      }).catch((err) => console.log(err))
    }
    
    _thief = () => {
        alert("Crime alert sent");
        const body = {
            lat: this.state.myLat,
            lng: this.state.myLng,
            type: "crime"
        }
        return fetch("http://159.89.226.72/updateIncident", {
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
              onRegionChange={(region) => {
                  this.setState({
                      latitude: region.latitude,
                      longitude: region.longitude,
                      latitudeDelta: region.latitudeDelta,
                      longitudeDelta: region.longitudeDelta,
                  })
              }}
              region={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: this.state.latitudeDelta,
                  longitudeDelta: this.state.longitudeDelta,
              }}>
              {
                  this.state.fast ?
                      <MapView.Polyline
                          coordinates={this.state.fcoords}
                          strokeWidth={2}
                          strokeColor="blue"/>
                      :
                      <View/>
              }
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
              {this.state.incidents ? this._placeIncident(this.state.incidents) : <View/>}
              <Marker
                  coordinate={{latitude: this.state.myLat, longitude: this.state.myLng}}
                  image={locIcon}
              />
          </MapView>
          <View pointerEvents="none" style={{position:"absolute", width: "100%", height: "100%"}}>
              {this.state.heatmap ? this._generateHeatMap(this.state.incidents) : <View/>}
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
                    }}
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
          <View style={{
                  bottom: "13%",
                  position: "absolute",
                  paddingHorizontal: 2,
                  paddingVertical: 2,
                  backgroundColor: "white",
                  borderRadius: 50 }}>
              <Switch value={this.state.fast} onValueChange={() => this.setState({fast: !this.state.fast})}/>
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
