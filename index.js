//API key would typically be hidden, but this is client-side only
const api = 'https://geo.ipify.org/api/v1?apiKey=at_WNBMYWKnfPN9JRxlisF0lUDcPxlvf'

//Initialize the map object
let myMap = new L.map('map', {
  zoomControl: false, 
  attributionControl: false
})

//Initialize the marker object 
let marker = new L.marker

//Will hold user's default coordinates base on public IP address 
let defaultCoordinates = []

//List of domain name extensions to check
const domainExtension = ['.com', '.tech', '.io', '.dev', '.net', '.gov', '.uk', '.ca', '.me', '.us', '.org', '.co', '.edu', '.int']

//Map automatically moves twice on each page load, set a counter to keep track
let moveEndCount = 0

//FIND USER'S DEFAULT IP ADDRESS, SET MAP & INFO TO USER'S IP ADDRESS
window.onload = function() {
  //Call the API
  fetchAddress(api)
  //Create map object and load it on screen
  .then(info => initializeMap(info))
  //Update DOM info for div.info
  .then(info => updatePage(info))
  //Hold user's default longitude and latitutde base on IP address 
  .then(info => defaultCoordinates = [info.location.lat, info.location.lng])
  .catch(error => error.message)
}

//FETCH NEW IP ADDRESS AFTER SUBMISSION
async function fetchAddress(url){
  const res = await fetch(url)
  //console.log(`Response received`)
  //console.log(res)

  //Error handler
  if(!res.ok) {
    const message = `A ${res.status} error has occured: ${res.statusText}`

    //Print error message on screen, erase when user clicks on search bar again 
    const error = document.querySelector('.error')
    error.innerHTML = 'Sorry, that is an invalid input. Please try again.'
    setTimeout(() => error.innerHTML = '', 4000)
    //ALTERNATE: Clear error message when user clicks on search bar
    // document.querySelector('input[type="text"]').addEventListener('click', () => error.innerHTML = '')

    throw new Error (console.log(message))
  }

  //Convert response to parseable JSON
  const info = await res.json()
  //console.log(info)
  defaultCoordinates = [info.location.lat, info.location.lng]
  return info
}

//Update page content with new IP address info
const updatePage = (info) => {
  //IP Adress
  document.querySelector('.ip p').innerHTML = info.ip

  //Location 
  document.querySelector('.location p').innerHTML = `${info.location.city}, ${info.location.region} ${info.location.postalCode}`

  //Timezone
  document.querySelector('.timezone p').innerHTML = `UTC ${info.location.timezone}`

  //ISP
  document.querySelector('.isp p').innerHTML = info.isp

  //Adjust view of map and icon 
  myMap.setView([info.location.lat, info.location.lng])
  marker.setLatLng([info.location.lat, info.location.lng])

  //Update placeholder text in search bar
  document.querySelector('input').placeholder = info.ip
  console.log('Page update completed')

  //Update global address value 
  address = info.ip

  return info
}

//Load the map on the screen
function initializeMap(info) {
  //console.log(info)
  //Set view of map object
  myMap.setView([info.location.lat, info.location.lng], 15)

//Initiate access to Mapbox map imaging
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXBlYW4xIiwiYSI6ImNrZnpkam95ajAzb3kyeW1paHNpdjd3cWQifQ.N4KX-ONAnPYxfdhN_iyb2Q', 
}).addTo(myMap);

//Create a map marker icon 
const icon = L.icon({
  iconUrl: '/images/icon-location.svg', 
  iconSize: [20, 25],
  //iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94], 
})

//Initialize marker object and set marker location
marker = L.marker([info.location.lat, info.location.lng], 
  {icon: icon, 
  // draggable: 'true', 
  // autoPan: true, 
  riseOffset: 300}).addTo(myMap)

return info
}

//Collect form input through an event listener
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()

  //Collect form input from text field
  const input = e.target[0].value

  let url = ''

  //Check if input is a domain or ip address; update fetch url accordingly
  hasDomainExtension(input) ? url = `${api}&domain=${input}` : url = `${api}&ipAddress=${input}`

  //Call the API
  fetchAddress(url) 
  .then(info => updatePage(info)) 
  .catch(error => error.message)
})

function hasDomainExtension(input) {
  return domainExtension.some(el => input.includes(el))
}

const backButton = document.querySelector('button.back')

//Display button.back when user moves the map
myMap.on('moveend', () => {
  ++moveEndCount
  //console.log(moveEndCount)
  if(moveEndCount > 2 && myMap.setView !== defaultCoordinates) {
    backButton.style.display='block'
  }
})

//EXTRA FEATURE: UPDATE LOCATION WHEN MARKER IS DRAGGED
// marker.on('click', onDrag)

// function onDrag(e) {
//   console.log('dragged')
// }

//Move map so that marker is in center when back button is clicked
backButton.addEventListener('click', (e) => {
  e.preventDefault()
  myMap.setView(defaultCoordinates)
  backButton.style.display='none'
  //Reset end count to 1, browser will count as 1 move when setView method is called
  moveEndCount = 1
})
