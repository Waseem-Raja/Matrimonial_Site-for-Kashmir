const express = require("express");

const app = express();
const {
    dirname
} = require("path");


const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const path = require('path'); //path module
const bodyparser = require("body-parser");
require('dotenv').config();
let alert = require('alert');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const schema = require("./schemas");
const controller = require("./controllers");
const middleware = require("./middleware");
const passwordecryptdecrypt = require("./passencrdect");









//connection with the database using mongoose
mongoose.connect(process.env.url, { //returns a promise
        useNewUrlParser: true
    }).then(() => console.log("connection Established with the Database")) //if promise fulfilled
    .catch((err) => console.log(err));




//Express stuff
//serving static files in express
app.use('/static', express.static('static'))
//now create a static folder and put files that you want to render inside that folder


//(parsing the req data )
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());




//ejs Stuff
//ejs (setting template engine)
app.set('view engine', 'ejs');
//set the views/templates directory
app.set('views', path.join(__dirname, 'views'));


// ENDOINTS=>

// Our main  endpoint
app.get("/", (req, res) => {
    res.status(200).render('main')
});
//Email end point
app.get("/contactus", (req, res) => {
    res.status(200).render('Email')
});
//Qr-code end point
app.get("/verifyAdhar", (req, res) => {
    res.status(200).render('Qrcode')
});

//forgotpassword end point
app.get("/forgotPassword", (req, res) => {

    res.status(200).render('forgotpassword')
});




//RENDERING THE PROFILE PAGE
app.get("/viewuserprofile", middleware.requireAuth, controller.viewprofile);




//for any non valid url end point
app.get("*", (req, res) => {

    res.status(404).render('404')
});



//FETCHING ADHAAR NUMBER AND NAME ON THE ADHAR CARD TO REGISTERATION FORM
//AND THEN RENDERING THE REGISTRATION FORM
app.post("/registration", middleware.cleanOtpdb, controller.registration);




//GETTING DATA FROM REGISTRATION FORM AND INSERTING IT INTO THE COLLECTION
//IF SUCESSFULL THEN RENDERING THE (CODE PAGE )
app.post("/Registrationn", controller.Registrationn);



//VALIDATING EMAIL AFTER REGISTRATION
//IF SUCESSFULL THEN REDIRECTING TO THE MAIN PAGE
app.post("/emailverification", controller.emailverification);


//login route(validation stuff)
//if validation is sucessfull then redirecting to user's profile
app.post("/loginn", controller.login);


//automatically getting oldpassword and oldusername in edit proile
//and then rendering the edit profile page
app.post("/editprofile", middleware.requireAuth, controller.editprofile);



//updating the data of edit profile
//then redirecting to the main page
app.post("/EditProfilee", middleware.requireAuth, controller.EditProfilee);


//Search Profiles route
//if any searched profile found then rendering it in Search page
app.post("/searchedprofiles", middleware.requireAuth, controller.searchedprofiles);



//viewing the Searched profiles by rendering view page
app.post("/viewsearchedprofile", middleware.requireAuth, controller.viewsearchedprofile);





//Sending otp on email address using nodemailer for password recovery
app.post("/passwordrecover", middleware.cleanOtpdb, controller.passwordrecover);



//sending password to email after verifying recieved otp
app.post("/otpprocessing", controller.otpprocessing);


//account deactivation
app.post("/deactivateaccount", middleware.requireAuth, controller.deactivateaccount);


//blog post end point(showing blogs)
app.post("/blog", controller.blog);


//inseting the posted blog into blog collection 
app.post("/postt",middleware.requireAuth ,controller.postt);



//read blog endpoint
app.post("/readstory", controller.readstory);



//edit blog end point
app.post("/editblogbtn", middleware.requireAuth, controller.editblogbtn);

//update blog end point
app.post("/updateblog", middleware.requireAuth, controller.updateblog);


//loging out module
app.post("/logout", middleware.requireAuth, controller.logout);


//contact us end point
app.post("/contactus", controller.contactus);


//Listing to the server
app.listen(process.env.port || 80, () => {
    console.log("listening on local host port 80");
})