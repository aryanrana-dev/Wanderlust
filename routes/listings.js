const express = require("express");
const router = express.Router();
const { IsLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controller/listings.js"); 
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index route
router.get("/", wrapAsync(listingController.index));

//New route
router.get("/new", IsLoggedIn, listingController.renderNewForm);

//Create route
router.post("/", IsLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));

//Read route
router.get("/:id", wrapAsync(listingController.showListing));

//Edit route
router.get("/:id/edit", IsLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update route
router.put("/:id", IsLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", IsLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
