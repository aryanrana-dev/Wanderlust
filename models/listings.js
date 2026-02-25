const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

Schema.post("findOneAndDelete",async function(doc) {
    if(doc) {
        await Review.deleteMany({_id: { $in: doc.reviews }})
    }
})

const Listing = mongoose.model("Listing",Schema);
module.exports = Listing;