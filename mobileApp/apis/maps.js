import Polyline from "@mapbox/polyline"
const API_KEY = "AIzaSyC51AmIegsbVJYl27hbh-yzcLJs7FaAEIE";

const BASE_URI = "https://maps.googleapis.com/maps/api/directions/json?";

const geo = ({lat, lng}) => `${lat},${lng}`;
const generateUri = (origin, dest, mode) =>
    `${BASE_URI}origin=${origin}&destination=${dest}&mode=${mode}&key=${API_KEY}`

const getDirections = (origin, dest, mode="walking") => {
    const uri = generateUri(geo(origin), geo(dest), mode)
    console.log(uri)
    return fetch(uri).then((res) => res.json())
}

const getPolyLines = (routes) => {
    let points = Polyline.decode(routes[0].overview_polyline.points);
    let coords = points.map((point) => {
        return  {
            latitude : point[0],
            longitude : point[1]
        }
    })
    return coords;
}

export { getDirections, getPolyLines }