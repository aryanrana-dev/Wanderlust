const fs = require("fs");
const util = require("util");
const data = require("./init/data_old");

// convert image object → string
data.data.forEach(listing => {
  if (typeof listing.image === "object" && listing.image.url) {
    listing.image = listing.image.url;
  }
});

// convert to JS-syntax string (not JSON)
const jsFormatted = `const sampleListings = ${util.inspect(data, { depth: null, compact: false })};\n\nmodule.exports = sampleListings;\n`;

fs.writeFileSync("data.js", jsFormatted);
console.log("✅ Cleaned and formatted as JavaScript.");