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
const GoogleStrategy = require("passport-google-oauth20").Strategy;      
const rateLimit = require("express-rate-limit");                                                                                                                                                                                                                                                                                                                                                                                                                                  

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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    skip: (req, res) => {
        const methodsToLimit = ["POST", "PUT", "DELETE"];
        return !methodsToLimit.includes(req.method);
    }
});

app.use(limiter);
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:7070/api/auth/google/callback",
    }, async function(accessToken, refreshToken, profile, done) {
        try {
        // 1. Check if this Google user already exists in your DB
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, log them in
          return done(null, user);
        }

        // 2. If not, check if they signed up with this email previously using a password
        const email = profile.emails[0].value;
        let existingEmailUser = await User.findOne({ email: email });

        if (existingEmailUser) {
          // Link the Google account to the existing email account
          existingEmailUser.googleId = profile.id;
          await existingEmailUser.save();
          return done(null, existingEmailUser);
        }

        // 3. If completely new user, create them
        const newUser = new User({
          email: email,
          username: profile.displayName.replace(/\s+/g, ''), // Create a username without spaces
          googleId: profile.id,
        });

        // Save directly (we don't use User.register because there is no password)
        await newUser.save();
        return done(null, newUser);

      } catch (err) {
        return done(err, null);
      }
    })
);

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