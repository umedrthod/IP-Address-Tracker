"use strict";
const form = document.querySelector(".search-form");
const input = document.querySelector(".search-input");
const result = document.querySelector("#result");
const mapContainer = document.querySelector("#map");
let map;

map = L.map("map").setView([0,0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    const ipAddress = input.value;
    const checkIpAddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    const checkDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

    if (checkIpAddress.test(ipAddress) || checkDomain.test(ipAddress)) {
        try {
            const apiKey = "444ff91e67094375870b72698cb5ba58"
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ipAddress}`);
            const data = await res.json();
            setAddress(data);
        } catch (error) {
            console.trace(error);
        }
    }
}

function setAddress(address) {
    if (address) {
        result.innerHTML = `
        <div class="result-container">
            <article>
            <h2>IP Address</h2>
            <p>${address.ip}</p>
            </article>

            <article>
            <h2>Location</h2>
            <p>${address.city}, ${address.state_prov}</p>
            </article>

            <article>
            <h2>Timezone</h2>
            <p>${address.time_zone.name}</p>
            </article>

            <article>
            <h2>ISP</h2>
            <p>${address.isp}</p>
            </article>
        </div>
        `;

        const lat = address.latitude || 0;
        const lng = address.longitude ||0;
        
        map.setView([lat, lng], 13);
        L.marker([lat, lng]).addTo(map);
    }
}
