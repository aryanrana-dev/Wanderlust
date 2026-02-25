
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('my-map');

    // 1. Check if the map container exists on this page
    if (!mapContainer) return;

    // 2. Read the raw string data from the HTML attributes
    const rawCoordinates = mapContainer.getAttribute('data-coordinates');
    const locationName = mapContainer.getAttribute('data-location');

    // 3. Convert the string back into a JavaScript object
    if (rawCoordinates) {
        const coordinates = JSON.parse(rawCoordinates);
        console.log("Parsed coordinates:", coordinates);

        // 4. Initialize the map using pure JavaScript
        const map = L.map('my-map').setView([coordinates.coordinates[1], coordinates.coordinates[0]], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        L.marker([coordinates.coordinates[1], coordinates.coordinates[0]]).addTo(map)
            .bindPopup(`<b>${locationName}</b>`)
            .openPopup();
            
    } else {
        mapContainer.innerHTML = "<p>Map coordinates are unavailable.</p>";
    }
});