const mongoose = require("mongoose");


//creating database schema(which defines the structure of the document)
const registrationSchemaa = new mongoose.Schema({
    Name: String,
    name: String,
    age: Number,
    password: String,
    Divorced: String,
    Adharno: Number,
    dob: String,
    gender: String,
    emaill: String,
    filee: String,
    qualification: String,
    txtEmpPhone: Number,
    chdistrict: String,
    Profession: String,
    Bio: String,
    Verified: Boolean,
    Deactivated: {
        type: Boolean,
        default: false
    }


});
//Creating Mongoose Model
//which provides an interface to the db for"creating,querying,updating ,deleting" records etc
const registrationn = mongoose.model('profile', registrationSchemaa);




//Creating schema for Otpcode db 
const Otpcode = new mongoose.Schema({

    email: String,
    code: String,
    expireIn: Number

});
//creating otpcode model(collection creation(Otpcode))
const otp = mongoose.model('Otpcode', Otpcode); //('collection name','schema name')




//Creating schema for Blog db 
const Blogsc = new mongoose.Schema({

    Date: Date,
    email: String,
    title: String,
    story: String,
    image: String

});
//creating otpcode model(collection creation(Blogs))
const blog = mongoose.model('Blogs', Blogsc); //('collection name','schema name')



//exporting to the main js file
module.exports = {
    registrationn,
    otp,
    blog
};