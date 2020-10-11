//Initialize map object
const myMap = L.map('map', {
  zoomControl: false, 
}).setView([51.505, -0.09], 15)

//Initiate access to Mapbox map imaging
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXBlYW4xIiwiYSI6ImNrZnpkam95ajAzb3kyeW1paHNpdjd3cWQifQ.N4KX-ONAnPYxfdhN_iyb2Q', 
}).addTo(myMap);



//Create a marker
const icon = L.icon({
  iconUrl: '/images/icon-location.svg', 
  iconSize: [20, 25],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94], 
})

//Initialize marker object 
const marker = L.marker([51.5, -0.09], {icon: icon}).addTo(myMap)



//API REQUEST LOGIC 
let address = ''
//API key would typically be hidden, but this is client-side only
const api = 'https://geo.ipify.org/api/v1?apiKey=at_WNBMYWKnfPN9JRxlisF0lUDcPxlvf&ipAddress='

let latitude = 0.0
let longitude = 0.0

//FIND USER'S DEFAULT IP ADDRESS, SET MAP & INFO TO USER'S IP ADDRESS
window.onload = function findDefaultIp() {
  //Call the API
  fetchAddress(api)
  .then(info => updatePage(info))
  .catch(error => error.message)
}

//Collect form input through an event listener
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()

  //Collect form input from text field
  const input = e.target[0].value
  console.log(`IP adress is: ${input || 'No input - default public IP Address'}`)

  //Reassign url value to include input
  address = input
  const url = api + address

  //Call the API
  fetchAddress(url)
  .then(info => updatePage(info))
  .catch(error => error.message)
})

//FETCH NEW IP ADDRESS AFTER SUBMISSION
async function fetchAddress(url){
  const res = await fetch(url)
  console.log(`Response received`)
  console.log(res)

  //Error handler
  if(!res.ok) {
    const message = `A ${res.status} error has occured: ${res.statusText}`
    throw new Error (console.log(message))
  }

  //Convert response to parseable JSON
  const info = await res.json()
  console.log(info)

  return info
}

//Update page content when new IP is inputted
const updatePage = (info) => {
  console.log('Page update in progress')

  //IP Adress
  document.querySelector('.ip p').innerHTML = info.ip

  //Location 
  document.querySelector('.location p').innerHTML = `${info.location.city}, ${info.location.region} ${info.location.postalCode}`

  console.log('Almost done...')

  //Timezone
  document.querySelector('.timezone p').innerHTML = `UTC ${info.location.timezone}`

  //ISP
  document.querySelector('.isp p').innerHTML = info.isp
  console.log('Page has been updated!')

  //Adjust view of map and icon 
  myMap.setView([info.location.lat, info.location.lng])
  marker.setLatLng([info.location.lat, info.location.lng])
  
}



