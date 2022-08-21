// ================ IMPORTS ================ //
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const PORT = 4200;
// ================||======||================ //


// Use cors to allow cross-origin resource sharing
// app.use(cors());
app.set('view engine', 'ejs');

// use session to store user data
app.use(session({
    secret: "28XgFymguHWW3XYbyFQkfZwedpRCtjs3b9sNxENqdXqDDk5rDvX2unshkk3IcYaz",
    cookie: {maxAge: 24 * 60 * 60 * 1000 * 7},
    saveUninitialized: true
}));

// allow json with requests
app.use(express.json());

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/Shade", {
    useNewUrlParser: true
});

// Listen for get request on /
app.get("/", (req, res) => {
    // check if user session exists
    let user = req.session.user;
    if(!user) {
        // if not, redirect to login page
        res.redirect("/login");
        return;
    }

    // Render home.html
    res.sendFile(__dirname + "/home.html");
});

// Login Page
app.get("/login", (req, res) => {
   
    // if user is logged in, redirect to home
    const userSession = req.session.user;
    if(userSession) {
        // redirect to home page.
        res.redirect("/")
        return;
    }

    // Render login.html
    res.sendFile(__dirname + "/login.html");
})

// Register Page
app.get("/register", (req, res) => {

    // if user is logged in, redirect to home
    const userSession = req.session.user;
    if(userSession) {
        // redirect to home page.
        res.redirect("/")
        return;
    }

    // Render register.html
    res.sendFile(__dirname + "/register.html");
})

// User routes for the login/register API
app.use(require("./Routes/User.js"));

// Start listening on PORT
app.listen(PORT, () => {
    console.log(`
    \u001b[1;41m Server Started! \u001b[0m
listening on port : ${PORT}
\u001b[1;36mVisit : \u001b[1;31mhttp://localhost:${PORT}/`)
})
