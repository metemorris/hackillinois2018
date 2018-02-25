import React from "react";
import {Dimensions} from "react-native";

export const runHeatMap = (coords, lat, lng) => {
    var max = 0;
    var width = Dimensions.get('window').width * 2.7;
    var height = Dimensions.get('window').height * 2.8;
    console.log(width);
    console.log(height);
    const LAT_ASC = 0.024;
    const LNG_ASC = 0.023;
    const points = coords.map((coord, idx) => {
        var val = Math.floor(Math.random()*100);
        max = Math.max(max, val);
        return {
            x: Math.floor(width/2 + (coord.lng-lng)*width/LNG_ASC),
            y: Math.floor(height/2 + (lat - coord.lat)*height/LAT_ASC),
            value: val
        }
    });

    return `
    var heatmapInstance = h337.create({
        container: document.getElementById("heatmap")
    });
    heatmapInstance.setData({
      max: ${max},
      data: ${JSON.stringify(points)}
    });
  `;
}