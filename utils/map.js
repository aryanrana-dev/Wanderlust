module.exports.getCoordinates = async (address) => {
    const apiKey = process.env.GEOCODE_API_KEY; 
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            console.log("No coordinates found for that address.");
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
    }
}