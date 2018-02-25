export const runScripts = (data) => {

    // now generate some random data
    var points = [];
    var max = 0;
    var width = 1080;
    var height = 1920;
    var len = 200;

    while (len--) {
        var val = Math.floor(Math.random()*100);
        max = Math.max(max, val);
        var point = {
            x: Math.floor(Math.random()*width),
            y: Math.floor(Math.random()*height),
            value: val
        };
        points.push(point);
    }

    var data = {
        max: max,
        data: points
    };

    return `heatmapInstance.setData(data);`
}