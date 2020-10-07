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
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
})

//Initialize marker object 
const marker = L.marker([51.5, -0.09], {icon: icon}).addTo(myMap)

