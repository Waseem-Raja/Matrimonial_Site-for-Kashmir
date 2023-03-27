const express = require("express");
const app = express();
const schema = require("./schemas"); //importing the schema file
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const path = require('path'); //path module
const fs = require("fs"); //file system module
const bodyparser = require("body-parser");
let alert = require('alert');
const passwordecryptdecrypt = require("./passencrdect");
const middleware = require("./middleware");
const jwt = require("jsonwebtoken");
const emailvalidator = require("email-validator");





const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({
        id
    }, 'net ninja secret', {
        expiresIn: maxAge
    });
}



//FETCHING ADHAAR NUMBER AND NAME ON THE ADHAR CARD TO REGISTERATION FORM
//AND THEN RENDERING THE REGISTRATION FORM
module.exports.registration = async (req, res) => {

    // let ob = {
    //     Name: 'Asifa Bano',
    //     name: 'Asifa',
    //     age: 28,
    //     password: 'diwwqwfw',
    //     Adharno: 901807777745,
    //     dob: '1998-06-18',
    //     gender: 'female',
    //     emaill: 'co,jydtd11@rubetti.com',
    //     filee: '/static/images/mudasir.jpeg',
    //     qualification: 'Graduate',
    //     txtEmpPhone: 7780803946,
    //     chdistrict: 'Kulgam',
    //     Profession: 'Teacher',
    //     Bio: 'hello peopl , i am d can take care of my family ',
    //     Verified: true,
    //     __v: 0,
    //     Deactivated: false,
    //     Divorced: 'No',
    //     test:"tested"
    // }
    // let ob = {
    //     Name: 'Zahid Ahmad Rather',
    //     name: 'zahid',
    //     age: 33,
    //     password: 'diwwqwfw',
    //     Adharno: 998700707543,
    //     dob: '1998-06-18',
    //     gender: 'male',
    //     emaill: 'mhxxgd711@rubetti.com',
    //     filee: '/static/images/mudasir.jpeg',
    //     qualification: 'Graduate',
    //     txtEmpPhone: 7780803946,
    //     chdistrict: 'Kulgam',
    //     Profession: 'Businessman',
    //     Bio: 'hello peopl , i am d can take care of my family ',
    //     Verified: true,
    //     __v: 0,
    //     Deactivated: false,
    //     Divorced: 'No'
    // }
    // let myData = ne/w schema.registrationn(ob);
    // console.log(myData);

    // myData.save();







    var adharnumber = req.body.Adharr;
    var AdharName = req.body.AdName;
    let Agender = req.body.Adgender;
    let Adistrict = req.body.Addistrict;
    let Adob = req.body.Adob;
    console.log(Agender)

    res.status(200).render('abc', {
        Adharrr: adharnumber,
        AName: AdharName,
        Agender: Agender,
        Adistrict: Adistrict,
        Adob: Adob

    });

}




//GETTING DATA FROM REGISTRATION FORM AND INSERTING IT INTO THE COLLECTION
//IF SUCESSFULL THEN RENDERING THE (CODE PAGE )
module.exports.Registrationn = async (req, res) => {


    //is password according to rules
    if (middleware.CheckPassword(req.body.password)) {



        //hasing password
        req.body.password = await passwordecryptdecrypt.encrypt(req.body.password);


        var validationuser = req.body.name; //fetching the Entered Username
        var Adharnumber = req.body.Adharno; //fetching the adhar number
        var emailL = req.body.emaill;

        //validating the email address
        let emailverify = await emailvalidator.validate(emailL);
        console.log(emailverify);
        if (emailverify) {
            //Calculating the Age 
            var dobb = req.body.dob;
            const xmas = new Date();
            const year = xmas.getFullYear();
            req.body.age = parseInt(year) - parseInt(dobb.substring(6, 10));
            //image url
            var profilee = req.body.filee;
            req.body.filee = "/static/images/" + profilee;
            req.body.Verified = false; //for email verification indication

            //validating the user
            //if the Name/adhar number/email id  already exists then alert
            console.log(req.body);

            schema.registrationn.findOne({ //(find returns a cursor pointer to the array of records)
                $or: [{
                        name: validationuser //validating username
                    }, {
                        Adharno: Adharnumber
                    },
                    {
                        emaill: emailL
                    }
                ]


            }, async function (err, data) { //callback function
                // console.log(data);

                if (data == null) { //if there is no such user with the same username or adharnumber then save the data
                    let myData = new schema.registrationn(req.body);
                    // console.log(myData);

                    myData.save().then(async () => {

                        //generating code
                        const sixcode = otpGenerator.generate(6, {
                            upperCaseAlphabets: false,
                            specialChars: false
                        });
                        //sending email for email validity 
                        const msg = {
                            from: "waseemrajamca44@gmail.com",
                            to: emailL,
                            subject: "Email Verification(Nikah.com)",
                            text: "code for email verification(you have only two minutes to fill this code in the code field) : " + sixcode
                        };
                        //sending mail to the user
                        // let check = await middleware.mail(msg);
                        nodemailer.createTransport({
                                service: 'gmail',
                                host: 'smtp.gmail.com',
                                port: 2525,     //587 scecure:false or 465 secure:true
                                auth: {
                                    user: "waseemrajamca44@gmail.com",
                                    pass: "xzuuqffkltbtypxd"
                                }
                            })
                            .sendMail(msg, (err) => {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    alert("Code sent sucessfully");

                                    return console.log("Email sent sucessfully");

                                }
                            })


                        let recv = emailL;
                        //saving the email,generated code into otp collection
                        let datam = new schema.otp({
                            email: recv,
                            code: sixcode,
                            expireIn: new Date() //storing the code creation time
                        });
                        datam.save();




                        //renderring the code page to accept the code sended to the user
                        res.status(200).render('verifyemailcode', {

                            email: emailL


                        });


                    }).catch(() => { //if rejected
                        res.status(400).send("profile was not saved to the databse")
                    })




                } else {
                    console.log(data);
                    alert("The Entered username/Adhar number/Email-id Already Exists, Please choose different one");
                    // res.redirect("/");

                    res.status(204).send();
                }
            });


        } else {
            alert("please enter valid email address");
            res.status(204).send();
        }

    } else {
        alert('your password must contain at least one numeric digit,  one uppercase, and one lowercase letter, and also no spaces');
        res.status(204).send();
    }
}
// else{
//     alert('your password must contain at least one numeric digit, one uppercase, and one lowercase letter,');
//     res.status(204).send();
// }



//VALIDATING EMAIL AFTER REGISTRATION
//IF SUCESSFULL THEN REDIRECTING TO THE MAIN PAGE
module.exports.emailverification = async (req, res) => {

    let Code = req.body.Rcode;
    let email = req.body.Remail;
    let passcode = ""; //temporaray variable

    schema.otp.findOne({ //searching in otp weather this email is present or not
        email: email
        // code: Code
    }, async function (err, data) {

        if (err)
            console.log(err);
        else if (data == null) {

            alert("token expired, Registration failed");
            res.redirect("/");
            //if there is no such email in record

        } else {

            if (data.code == Code) { //if email is present now check if code is matching
                console.log(data);
                let currentTime = new Date();
                let codeGeneratedTime = data.expireIn;
                var result = Math.abs(codeGeneratedTime - currentTime) / 1000;
                var minutes = Math.floor(result / 60) % 60;
                console.log("<br>Difference (Minutes): " + minutes);
                if (minutes < 2) {

                    schema.registrationn.findOne({
                        emaill: email
                    }, async function (err, data) {
                        if (err)
                            console.log(err)
                        else if (data == '') {
                            alert("no such record found");
                            res.redirect("/");
                        } else {
                            console.log(data);
                            let dattt = await schema.registrationn.updateOne({
                                emaill: email
                            }, {
                                Verified: true
                            });
                            alert("Registeration sucessfull");
                            res.redirect("/");

                        }


                    });

                } else {

                    let datttt = await schema.registrationn.deleteOne({
                        emaill: email
                    });
                    console.log(datttt);
                    alert("Registration unsucessfull exceeded time limit for verification code")
                    res.redirect("/");


                }
            } else {
                alert("invalid code please try to use correct one");
                res.status(201).send();
            }
        }

    });



}

//login route(validation stuff)
//if validation is sucessfull then redirecting to user's profile
module.exports.login = async (req, res) => {

    let nameeee = req.body.user; //getting the entered username
    let passworddd = req.body.pass; //getting the entered password
    let hashpassword = await passwordecryptdecrypt.encrypt(passworddd);
    // console.log(hashpassword);

    console.log(nameeee);
    schema.registrationn.findOne({
        name: nameeee //checking weather user is prensent or not
    }, async function (err, data) {

        if (err)
            console.log(err);
        else if (data == null) {

            //if this login info isn't present in the db that means 
            //  he/she has not registred yet
            alert("Please Register first, then try to login");
            //    req.flash('message')

            // res.redirect("/");
            res.status(204).send();

        } else {


            // console.log(data.password);
            if (hashpassword == data.password) { // comparing password's
                if (data.Verified == true) { //if email is verified then proceed

                    //if user has deactivated and is logging again make his
                    //Deactivaion false
                    if (data.Deactivated == true) {

                        let updateuser = await schema.registrationn.updateOne({
                            emaill: data.emaill
                        }, {

                            Deactivated: false
                        });
                        console.log("user is Deactivated" + data.Deactivated);
                        alert("Wellcome Back " + data.Name);
                    }
                    //jwt(cookie)
                    //creating jwt token
                    const token = createToken(data._id);
                    // console.log(token);
                    //storing and sending jwt token to cookies in the browser
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 25892000000),
                        //automatic expire after 30 dys 
                        httpOnly: true
                    });


                    //redirecting to user's profile after sucessfully logging in
                    app.set('Userr', data._id);
                    res.redirect("/viewuserprofile");

                } else {
                    alert("Unverified Account (please verify your email first)");
                    res.redirect("/");
                }
            } else {
                alert("please enter correct password ");
                res.status(204).send();
            }
        }
    });



}
//RENDERING THE PROFILE PAGE
module.exports.viewprofile = async (req, res) => {

    let id = app.get('Userr'); // getting the username from the login route 
    // console.log(nameeee+"vyo");

    schema.registrationn.findOne({
        _id: id //checking weather user is prsent or not
    }, async function (err, data) {

        if (err)
            console.log(err);
        else if (data == null) {

            //if this login info isn't present in the db that means 
            //  he/she has not registred yet
            alert("Please Register first, then try to login");
            // res.redirect("/");
            res.status(204).send();

        } else {


            // console.log(data.password);

            res.status(200).render('profile', {
                Name: data.Name,
                Age: data.age,
                Height: data.Divorced,
                DOB: data.dob,
                gender: data.gender,
                email: data.emaill,
                qualification: data.qualification,
                district: data.chdistrict,
                profession: data.Profession,
                profilepic: data.filee,
                usernamee: data.name,
                phone: data.txtEmpPhone,
                bio: data.Bio,
                passwordd: data.password





            });

        }
    });
}




//automatically getting oldpassword and oldusername in edit proile
//and then rendering the edit profile page
module.exports.editprofile = (req, res) => {

    // var Veusernam = req.body.username;
    // var Vepassword = req.body.password;
    let id = req.body.id;

    // console.log(req.body);
    // console.log(Veusernam);
    // console.log(Vepassword);

    // res.status(200).render('EditProfile', {
    //     Olduname: Veusernam,
    //     Oldpass: Vepassword
    // });

    schema.registrationn.find({ //find returns a curson(pointer to the array of records)
        // name: Veusernam
        _id: id
    }, async function (err, data) {

        if (err)
            console.log(err);

        else {
            //decrypting password
            console.log(data[0].password);
            let password = await passwordecryptdecrypt.decrypt(data[0].password);

            res.status(200).render('EditProfile', {
                // Olduname: Veusernam,
                // Oldpass: Vepassword,

                username: data[0].name,
                Eheight: data[0].Divorced,
                Eprofession: data[0].Profession,
                Equalification: data[0].qualification,
                Edistrict: data[0].chdistrict,
                profilepic: data[0].filee,
                Ebio: data[0].Bio,
                Epassword: password,
                Ephone: data[0].txtEmpPhone





            });


        }
    });

}


//updating the data of edit profile
//then redirecting to the main page
module.exports.EditProfilee = async (req, res) => {
    debugger
    var flag = 0;
    // var olduname = req.body.Olduname; //username
    // var oldpas = req.body.Oldpass;
    let id = req.body.id;

    // console.log(olduname +" " + oldpas);
    var Pname = req.body.pname; //username
    // var Page = req.body.page;
    var Pheight = req.body.pheight; //divorced input
    var Ppassword = req.body.ppassword;

    if (middleware.CheckPassword(Ppassword)) {
        var Pprofile = "/static/images/" + req.body.pprofile;
        var Pemail = req.body.pemail;
        var Pphone = req.body.pphone;
        var Pprofession = req.body.pproffesion;
        var Pdistrict = req.body.pdistrict;
        var Pbio = req.body.pBio;

        var dbname;
        var dbpass;
        // var dbage;
        var dbheight;
        var dbprofile;
        var dbemail;
        var dbphone;
        var dbprofession;
        var dbdistrict;
        var dbBio;

        let findUser = await schema.registrationn.findOne({ //find returns a curson(pointer to the array of records)
            // name: olduname,
            // password: 
            _id: id
        });
        // console.log(findUser)

        dbname = findUser.name;
        // dbage = data[0].age;
        dbheight = findUser.Divorced;
        dbpass = findUser.password;
        dbprofile = findUser.filee;
        dbemail = findUser.emaill;
        dbprofession = findUser.Profession;
        dbphone = findUser.txtEmpPhone;
        dbdistrict = findUser.chdistrict;
        dbBio = findUser.Bio;


        var indicate = 0;
        let flagg = 0;

        debugger
        //filtering the Entered values 
        if (Pname == '') { //if the entered user name is empty
            Pname = dbname;
        } else {
            console.log(Pname + "" + dbname);
            if (Pname == dbname) { //if the entered username is same as previous one
                indicate = 0;

            } else { //if the entered username is different from previous one the check
                //if this username is taken or not


                let validuser = await schema.registrationn.findOne({
                    name: Pname
                });
                if (validuser != null) { //i.e if the entered username is already taken

                    indicate = 1;

                } else {
                    indicate = 0;
                    flagg = 1;
                }
            }


        }
        // if (Page == '')
        //     Page = dbage;
        // console.log(indicate);
        if (indicate == 0) {
            if (Pheight == '')
                Pheight = dbheight;
            if (Ppassword == '')
                Ppassword = dbpass
            else {
                Ppassword = await passwordecryptdecrypt.encrypt(Ppassword);
                // if (Ppassword != dbpass)
                // flagg = 1;
            }
            if (Pprofile == '/static/images/')
                Pprofile = dbprofile;
            if (Pemail == '')
                Pemail = dbemail;
            if (Pphone == '')
                Pphone = dbphone;
            if (Pprofession == '')
                Pprofession = dbprofession
            if (Pdistrict == '')
                Pdistrict = dbdistrict
            if (Pbio == '')
                Pbio = dbBio


            let update = await schema.registrationn.updateOne({
                    // name: olduname,
                    // password: oldpas //querying the username and password 
                    _id: id
                }, {

                    name: Pname, //updating the data
                    // age: Page,
                    Divorced: Pheight,
                    password: Ppassword,
                    emaill: Pemail,
                    filee: Pprofile,
                    Profession: Pprofession,
                    txtEmpPhone: Pphone,
                    chdistrict: Pdistrict,
                    Bio: Pbio
                }
                //use callback if async/await not used 
                // , function (err, update) {
                //     if (err)
                //         console.log(err);
                //     else
                //         console.log(update);
                // }
            )
            console.log(update);

            alert("profile updated");
            // if (flagg == 1){ //if password or username is changed then redirect to main page 

            //     res.clearCookie('jwt');
            //     res.redirect("/");

            // }
            // else
            res.status(204).send();

        } else {
            alert("entered username is already taken, Please choose a different one");
            res.status(204).send();
        }
    } else {
        alert('your password must contain at least one numeric digit, one uppercase, and one lowercase letter, and no spaces');
        res.status(204).send();
    }
}


//Search Profiles route
//if any searched profile found then rendering it in Search page
module.exports.searchedprofiles = (req, res) => {

    var sage1 = req.body.Sage1;
    var sage2 = req.body.Sage2;
    var sdistrict = req.body.Sdistrict;
    var sgender = req.body.Sgender;

    var suser = req.body.Suser; //current user
    // console.log(suser);

    if (sage1 == undefined || sage2 == undefined || sdistrict == undefined || sage1 > sage2)
        alert("Please enter a valid Query");
    else {
        schema.registrationn.find({ //find returns a curson(pointer to the array of records)

            // name: {
            //     $nin: suser
            // }, //search for all users except the current user
            // age: sage
            age: {
                '$gte': sage1,
                '$lte': sage2
            }, //age between entered ages
            chdistrict: sdistrict,
            gender: sgender,
            Verified: true, //account should be verified
            Deactivated: false //account should be acctivated

        }, function (err, data) {

            if (err)
                console.log(err);
            else if (data == '') {

                alert("No record found");
                //if there is no such record

            } else {
                // const obj = JSON.parse(data);
                // var dobb = data[0].dob;

                // console.log(dobb)
                res.status(200).render('Search', {
                    profidata: data



                });
            }
        });

    }
    // res.redirect("/");

}



//viewing the Searched profiles by rendering view page
module.exports.viewsearchedprofile = (req, res) => {


    var Vusernam = req.body.Vusername;
    schema.registrationn.find({ //find returns a curson(pointer to the array of records)
        name: Vusernam
    }, function (err, data) {

        if (err)
            console.log(err);



        else {

            res.status(200).render('view', {


                Vname: data[0].name,
                VName: data[0].Name,
                Vage: data[0].age,
                Vheight: data[0].Divorced,
                Vgender: data[0].gender,
                Vprofession: data[0].Profession,
                Vqualification: data[0].qualification,
                Vdistrict: data[0].chdistrict,
                profilepic: data[0].filee,
                Vbio: data[0].Bio,
                Vemail: data[0].emaill




            });


        }
    });


}




//Sending otp on email address using nodemailer for password recovery
module.exports.passwordrecover = async (req, res) => {


    const receiver = req.body.email;
    let emailverify = await emailvalidator.validate(receiver);
    // console.log(emailverify);
    if (emailverify) {


        // console.log(receiver);
        schema.registrationn.findOne({ //validating the email if its present in our db or not
            emaill: receiver
        }, async function (err, data) {

            if (err)
                console.log(err);
            else if (data == null) {

                alert("Not a registered email address");
                res.redirect("/forgotPassword");
                //if there is no such email in record

            } else {
                //generating code
                const sixcode = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    specialChars: false
                });


                //sending email 
                const msg = {
                    from: "waseemrajamca44@gmail.com",
                    to: receiver,
                    subject: "Password Recovery(Nikah.com)",
                    text: "code to recover your password(you have only two minutes to fill this code in the code field) : " + sixcode
                };
                // let check = await middleware.mail(msg);
                nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 2525,
                        auth: {
                            user: "waseemrajamca44@gmail.com",
                            pass: "xzuuqffkltbtypxd"
                        },

                    })
                    .sendMail(msg, (err) => {
                        if (err) {
                            return console.log('Error occurs', err);
                            res.redirect("/forgotPassword");
                        } else {
                            alert("Code sent sucessfully");

                            return console.log('Email sent sucessfully');

                        }
                    })

                // storing the email and the code into the otp db
                var myData = new schema.otp({
                    email: receiver,
                    code: sixcode,
                    expireIn: new Date() //storing the code creation time
                });
                myData.save();
                // res.redirect("/");
                //stopping the process on the current page
                res.status(204).send();
            }
        });
    } else {
        alert("please enter valid email address");
        res.status(204).send();
    }

}


//sending password to email after verifying recieved otp
module.exports.otpprocessing = (req, res) => {

    //Receiving the code and email
    let Code = req.body.hotp;
    let email = req.body.hemail;
    let passcode = ""; //temporaray variable

    schema.otp.findOne({ //searching in otp db weather this email and code exists or not
        email: email,
        code: Code
    }, function (err, data) {

        if (err)
            console.log(err);
        else if (data == null) {

            alert("token expired");
            //if there is no such email in record

        } else {

            let currentTime = new Date();
            let codeGeneratedTime = data.expireIn;
            var result = Math.abs(codeGeneratedTime - currentTime) / 1000;
            var minutes = Math.floor(result / 60) % 60;
            console.log("<br>Difference (Minutes): " + minutes);
            if (minutes < 2) {



                schema.registrationn.findOne({ //now the find this email in the original db
                    //and fetch its password
                    emaill: email
                }, async function (err, data) {
                    debugger
                    passcode = await passwordecryptdecrypt.decrypt(data.password);
                    // passcode = data.password; //fetching password

                    //enailing the password
                    const msg = {
                        from: "waseemrajamca44@gmail.com",
                        to: email,
                        subject: "Password Recovery (Nikah.com)",
                        text: "Your password :" + passcode
                    };
                    // let check = await middleware.mail(msg);
                    nodemailer.createTransport({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            port: 25,
                            auth: {
                                user: "waseemrajamca44@gmail.com",
                                pass: "xzuuqffkltbtypxd"
                            },
                        })
                        .sendMail(msg, (err) => {
                            if (err) {
                                return console.log('Error occurs', err);
                            } else {
                                alert("Password sent sucessfully");

                                return console.log('Password sent sucessfully');

                            }
                        })
                    res.redirect("/");
                });
                // res.redirect("/");
            } else {
                alert("token expired ");
                res.redirect("/");
            }
        }

    });


}

//account deactivation
module.exports.deactivateaccount = async (req, res) => {

    let email = req.body.emaild;

    //find the person from the main collection and 
    //make Deactivated to true (which indicates the account deactivation and acctivation)
    let updateuser = await schema.registrationn.updateOne({
        emaill: email
    }, {

        Deactivated: true
    });

    console.log(updateuser);

    res.clearCookie('jwt'); //clear the jwt token
    res.redirect("/");




}

//blog post end point(showing blogs)
module.exports.blog = async (req, res) => {



    let data = await schema.blog.find();
    // console.log(data);
    res.status(200).render('blog', {
        blogdata: data

    });



}
//inseting the posted blog into blog collection 
module.exports.postt = async (req, res) => {


    // console.log(req.body);
    // let bpassword = req.body.Bpass;
    // let bemail = req.body.Bemail;

    let id = app.get('Userr');
    // console.log(hh);
    let imagg = "/static/images/" + req.body.imageb;
    req.body.Bdate = new Date();
    // bpassword = await passwordecryptdecrypt.encrypt(bpassword);

    // let emailverify = await emailvalidator.validate(bemail);
    // console.log(emailverify);
    // if (emailverify) {

    schema.registrationn.findOne({ //find returns a curson(pointer to the array of records)
        // emaill: bemail,
        // password: bpassword
        _id: id
    }, async function (err, data) {

        if (err)
            console.log(err);
        else if (data == null) {

            alert("Please Register first ");
            res.status(204).send();

        } else {

            console.log(data);
            let email = data.emaill;
            console.log(email);
            let alreadyPosted = await schema.blog.findOne({
                email: email
            });

            if (alreadyPosted == null) {

                let data = new schema.blog({
                    email: email,
                    story: req.body.Bstory,
                    Date: req.body.Bdate,
                    title: req.body.Btitle,
                    image: imagg

                });
                data.save();
                alert("sucuessfully posted");
                res.status(204).send();
                // res.redirect("/");
            } else {
                alert("Already posted, you can post only once");
                res.status(204).send();
            }

        }
    });
}
// else {
//     alert("please enter valid email address");
//     res.status(204).send();
// }

// }


//read blog endpoint
module.exports.readstory = (req, res) => {

    schema.blog.findOne({
        email: req.body.email
    }, (err, data) => {
        if (err)
            console.log(err)
        else {
            res.status(200).render('viewblog', {
                story: data.story,
                title: data.title

            });
        }
    })

}


//edit blog end point
module.exports.editblogbtn = async (req, res) => {

    let email = req.body.emailb;


    let user = await schema.blog.findOne({
        email: email
    });
    if (user == null) {
        res.status(204).send();
        alert("Oops You have't posted anything yet");


    } else {

        res.status(200).render('editblogview', {


            storyy: user.story,
            title: user.title,
            email: user.email,






        });
    }

}
//update blog end point
module.exports.updateblog = async (req, res) => {

    let titile = req.body.titleu;
    let story = req.body.storyu;
    let email = req.body.emailu;
    let img = "/static/images/" + req.body.imageb;

    let person = await schema.blog.findOne({
        email: email
    });

    //ternary operator's to check if input fields are sended empty 
    titile = titile == "" ? person.title : titile;
    story = story == "" ? person.story : story;
    img = img == "/static/images" ? person.image : img;







    let user = await schema.blog.updateOne({
        email: email
    }, {
        title: titile,
        story: story,
        image: img
    })
    alert("blog updated scucessfully");
    res.status(204).send();
}

//loging out module
module.exports.logout = async (req, res) => {

    // res.cookie('jwt', '', {
    //     maxAge: 1
    // }); //deleting jwt token by replacing it with '' and it
    // // will get expired after 1 second
    res.clearCookie('jwt');
    alert("logged out sucessfully");
    res.redirect("/"); //redirecting to the home page

}

//contact us end point
module.exports.contactus = async (req, res) => {

    let email_id = req.body.email;
    let from_name = req.body.name;
    let message = req.body.message;

    let emailverify = await emailvalidator.validate(email_id);
    console.log(emailverify);
    if (emailverify) {
        // console.log(req.body)
        let mailDetails = {

            from: email_id,
            to: "waseemrajamca44@gmail.com",
            subject: "(Nikah.com 'feedback')" + "from " + from_name,
            text: message

        };

        // let check = await middleware.mail(mailDetails);
        // console.log(check);
        // res.status(204).send();
        let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "waseemrajamca44@gmail.com",
                    pass: "xzuuqffkltbtypxd"
                }
            })
            .sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs');
                    alert('Oops, there occurs some error try again');
                    res.status(204).send();
                    // res.status(400).json({msg:"oops there occurs some error"});

                } else {
                    alert('Email sent successfully');
                    res.status(204).send();
                    // res.status(200).json({msg:"Email sent sucessfully"});
                }
            })
    } else {
        alert("please enter valid email address");
        res.status(201).send();
    }

}