if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");   
const userRouter = require("./routes/user.js");
const session = require("express-session");     
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");      
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");                                                                                                                                                                                                                                                                                                                                                                                                                                         

let dbUrl = process.env.MONGODB_ATLAS_URL;

main().then((res) => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SUPER_SECRET_KEY
    }
});

store.on("error", function(e) {
    console.log("MongoDB Session store error", e);
});

const sessionConfig = {
    store,
    secret: process.env.SUPER_SECRET_KEY,
    resave: false,
    saveUninitialized: true,    
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
//Catch all route

app.all("/{*any}",(req,res,next) => {
    throw new ExpressError(404,"Page not found");
})

//Error handling middleware
app.use((err,req,res,next) => {
    let {status=500, message="Something went wrong"} = err;
    res.status(status).render("listings/error.ejs",{err});
})

app.listen(7070,() => {
    console.log("listening to port 7070");
})