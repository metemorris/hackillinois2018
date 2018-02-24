const API_KEY = "AIzaSyC51AmIegsbVJYl27hbh-yzcLJs7FaAEIE";

const BASE_URI = "https://maps.googleapis.com/maps/api/directions/json?";

const geo = (lat, lng) => `${lat},${lng}`;
const generateUri = (origin, dest, mode=) =>
    `${BASE_URI}origin=${origin}&dest=${dest}&mode=${mode}&key=${API_KEY}`

const getDirections = (origin, dest, mode="walking") => {
    const uri = generateUri(origin, dest, mode)
    console.log(uri)
    return fetch(uri).then((res) => res.json())
}

export { getDirections }