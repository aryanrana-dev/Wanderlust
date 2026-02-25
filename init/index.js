const mongoose = require("mongoose");
const initData = require("./dataNew.js");
const Listing = require("../models/listings.js");
const { init } = require("../models/user.js");

let Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res) => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_URL);
}

async function initDb(req,res) {
    await Listing.deleteMany({});
    initData.data.forEach(el => { el.owner = "69838e2f3579f1768e9f613c" });
    await Listing.insertMany(initData.data);
    console.log("data is intialized");
}
initDb();