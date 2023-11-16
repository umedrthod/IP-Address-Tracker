"use strict";

// DOM elements
const form = document.querySelector("#searchForm");
const input = document.querySelector("#ipAddressInput");
const result = {
    ipAddress: document.querySelector("#ipAddress"),
    location: document.querySelector("#location"),
    timezone: document.querySelector("#timezone"),
    isp: document.querySelector("#isp")
};
const mapContainer = document.querySelector("#map");
let map;

// Initialize Leaflet map
map = L.map("map").setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

// Event listener for form submission
form.addEventListener("submit", handleSubmit);

/**
* Handles the submit event of the form
* @param {Event} event - the submit event
* @returns {Promise} - a promise that resolves with the IP address data
*/
async function handleSubmit(event) {
    event.preventDefault();
    const ipAddress = input.value;
    const checkIpAddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    const checkDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

    if (checkIpAddress.test(ipAddress) || checkDomain.test(ipAddress)) {
        try {
            const apiKey = "444ff91e67094375870b72698cb5ba58";
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ipAddress}`);
            const data = await res.json();
            setAddress(data);
        } catch (error) {
            console.trace(error);
        }
    }
}

/**
* Sets the address information on the page
* @param {Object} address - the address object
*/
function setAddress(address) {
    if (address) {
        result.ipAddress.textContent = address.ip || "";
        result.location.textContent = `${address.city}, ${address.state_prov}` || "";
        result.timezone.textContent = address.time_zone.name || "";
        result.isp.textContent = address.isp || "";

        const lat = address.latitude || 0;
        const lng = address.longitude || 0;

        map.setView([lat, lng], 13);
        L.marker([lat, lng]).addTo(map);
    }
}