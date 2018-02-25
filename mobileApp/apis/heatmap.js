export const runHeatMap = (coords, lat, lng) => {
    var max = 0;
    var width = 1080;
    var height = 1920;
    const LAT_ASC = 0.11;
    const LNG_ASC = 0.22;
    const points = coords.map((coord, idx) => {
        var val = Math.floor(Math.abs(coord[0].lat));
        max = Math.max(max, val);
        return {
            x: width/2 + Math.floor((coord.lat-lat)*width*LAT_ASC),
            y: height/2 + Math.floor((coord.lng-lng)*height*LNG_ASC),
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