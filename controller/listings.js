const Listing = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js");
const { getCoordinates} = require("../utils/map.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/home.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    const url = req.file.path;
    const filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    const { location, country } = req.body.listing;
    const address = `${location}+${country}`;
    const coordinates = await getCoordinates(address);
    if (coordinates) {
        newListing.geometry = {
            type: "Point",
            coordinates: [coordinates.lon, coordinates.lat]
        }
    } 
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let previewUrl = listing.image.url;
    previewUrl = previewUrl.replace("/upload", "/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue");
    if (!listing) {
        req.flash("error", "Cannot find that listing");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing, previewUrl });
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        updatedListing.image = { url, filename };
    }
    const { location, country } = req.body.listing;
    const address = `${location}+${country}`;
    const coordinates = await getCoordinates(address);
    if (coordinates) {
        updatedListing.geometry = {
            type: "Point",
            coordinates: [coordinates.lon, coordinates.lat]
        }
    }
    await updatedListing.save();
    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
};
