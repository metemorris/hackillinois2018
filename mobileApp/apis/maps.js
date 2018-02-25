import Polyline from "@mapbox/polyline"
const API_KEY = "AIzaSyC51AmIegsbVJYl27hbh-yzcLJs7FaAEIE";

const BASE_URI = "https://maps.googleapis.com/maps/api/directions/json?";

const geo = ({lat, lng}) => `${lat},${lng}`;
const generateUri = (origin, dest, mode) =>
    `${BASE_URI}origin=${origin}&destination=${dest}&mode=${mode}&alternatives=true&key=${API_KEY}`

const getDirections = (origin, dest, mode="walking") => {
    const uri = generateUri(geo(origin), geo(dest), mode)
    console.log(uri)
    return fetch(uri).then((res) => res.json())
}

const getPolyLines = (routes) => {
    let body = routes.map((route) => {
        let points = Polyline.decode(route.overview_polyline.points);
        return points.map((point) => ({
            lat : point[0],
            lng : point[1]
        }))
    });
    console.log(JSON.stringify(body))
    return fetch("http://159.89.226.72/get/traffic", {
        body: JSON.stringify(body),
        method: 'POST'
    }).then((res) => res.json())
        .then((data) => data.traffic)
        .then((heat) => {
            let max = 0;
            let idx = 0;
            for(let i=0; i<heat.length; i++) {
                if(max < heat[i]) {
                    max = heat[i];
                    idx = i;
                }
            }
            let points = Polyline.decode(routes[idx].overview_polyline.points);
            let points2 = Polyline.decode(routes[0].overview_polyline.points);
            let good = points.map((point) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            let fast = points2.map((point) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            console.log(good)
            return {good, fast};
        })
}

export { getDirections, getPolyLines }