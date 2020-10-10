//Initialize map object
const myMap = L.map('map').setView([51.505, -0.09], 13)

//Initiate access to Mapbox map imaging
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXBlYW4xIiwiYSI6ImNrZnpkam95ajAzb3kyeW1paHNpdjd3cWQifQ.N4KX-ONAnPYxfdhN_iyb2Q'
}).addTo(myMap);

//Create circle marker
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
let address = '0.0.0'
//API key would typically be hidden, but this is client-side only
const api = 'https://geo.ipify.org/api/v1?apiKey=at_WNBMYWKnfPN9JRxlisF0lUDcPxlvf&ipAddress='

//Collect form input through an event listener
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()

  //Collect form input from text field
  const input = e.target[0].value
  console.log(`IP adress is: ${input}`)

  //Reassign url value to include input
  address = input
  const url = api + address

  //Call the API
  fetchAddress(input, url)
  .then(info => updatePage(info))
  .catch(error => error.message)
})

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
}

//Fetch IP address after form submission 
async function fetchAddress(input, url){
  const res = await fetch(url)
  console.log(`Fetch function shows that response is being put out`)
  console.log(res)

  //Error handler
  if(!res.ok) {
    const message = `An error has occured: ${res.status} ${res.statusText}`
    throw new Error (console.log(message))
  }

  const info = await res.json()
  console.log(`Fetch function shows that info is good`)
  console.log(info)
  return info
}

//Store needed values
//.then(info => infoCollector(info))

//Collect information needed to update on page 
const infoCollector = (info) => {
  let obj = {}
  obj.ip = info.ip
  obj.city = info.location.city 
  obj.state = info.location.region
  obj.zip = info.location.postalCode
  obj.timezone = `UTC ${info.location.timezone}`
  obj.isp = info.isp
  obj.lat = info.lat
  obj.lng = info.lng
  console.log(obj)
  return obj
}
