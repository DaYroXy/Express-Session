const express = require("express");
const router = express.Router();
const User = require("../Database/User.Model.js");


// Register Router
router.post("/register", async (req, res) => {
    // get session
    const userSession = req.session.user;
    if(userSession) {
        res.json({
            status: "error",
            message: "You are already logged in."
        });
        return;
    }

    // Get username and password from the request body
    const {username, password} = req.body

    // check if username or password is empty
    if(!username || !password) {
        
        // if empty, response with error
        res.json({
            status: "error",
            message: "Please fill all fields"
        })
        return;
    }

    // check if username exists in the database
    // mongoose is promise, so we use await to wait for the promise to resolve
    let user = await User.findOne({"username": username})

    // if user exists, response with error
    if(user) {
        // response with error
        res.json({
            status: "error",
            message: "Username already exists"
        })
        return;
    }

    // create new user inside of the database
    let userData = await User.create({
        username: username,
        password: password
    })

    console.log(userData)

    res.json({
        status: "success",
        message: "User Register Successfully! Please go to login page."
    });
})

// Login Router
// we use async in order to allow await, we cannot use await without async
router.post("/login", async (req, res) => {

    // Get username and password from the request body
    const {username, password} = req.body

    // check if username or password is empty
    if(!username || !password) {
        
        // if empty, response with error
        res.json({
            status: "error",
            message: "Please fill all fields"
        })
        return;
    }

    // check if username exists in the database
    // mongoose is promise, so we use await to wait for the promise to resolve
    let user = await User.findOne({"username": username})
    
    // if user does not exist
    if(!user) {

        // response with error
        res.json({
            status: "error",
            message: "Username does not exist"
        })
        return;
    }

    // check if password is correct
    if(user.password !== password) {
        // response with error
        res.json({
            status: "error",
            message: "Password is incorrect"
        })
        return;
    }
    
    // mongodb returns read only data, so we change it to an object
    user = user.toObject();

    // hide password from user object
    delete user.password;

    // set user session to user data
    req.session.user = user;
    // save session
    req.session.save();
    res.json({
        status: "success",
        message: "User Logged In!"
    });
})

// get my data
router.get("/me", async (req,res) => {
    // get session
    const userSession = req.session.user;
    if(!userSession) {
        res.json({
            status: "error",
            message: "You are not logged in."
        });
        return;
    }
    
    // return my data
    let user = await User.findById(userSession._id)
    res.json(user);
})


// Signout 
router.get("/signout", async (req,res) => {
    // get session
    const userSession = req.session.user;
    if(!userSession) {
        res.json({
            status: "error",
            message: "You are not logged in."
        });
        return;
    }
    
    // delete session
    req.session.destroy();
    res.json({
        status: "success",
        message: "User Signed Out!"
    })
})

module.exports = router;