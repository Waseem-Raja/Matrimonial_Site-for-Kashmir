const schema = require("./schemas");
const jwt = require("jsonwebtoken");
let alert = require('alert');
const nodemailer = require("nodemailer");


//Cleaning THE Unverified REQUESTS 
//middleware has access to both req, res objects
// const cleanOtpdbb = async (req, res, next) => {



//     let currentTime = new Date();

//     let count = await schema.otp.find().count();
//     console.log(count);
//     if (count > 0) {

//         let data = await schema.otp.find(); //collect all the sended user otp's

//         for (let user of data) { //loop over all sended otp's 
//             //if the timelimit exceeds then delete that record from db

//             let codeGeneratedTime = user.expireIn;
//             var result = Math.abs(codeGeneratedTime - currentTime) / 1000;
//             var minutes = Math.floor(result / 60) % 60;
//             // console.log("<br>Difference (Minutes): " + minutes);
//             if (minutes >= 2) {
//                 let delemail = user.email;
//                 // console.log(delemail);
//                 await schema.otp.deleteOne({
//                     email: delemail

//                 });

//                 let datttaa = await schema.registrationn.findOne({
//                     emaill: delemail
//                 });
//                 // console.log(datttaa);
//                 // , async function (err, daTa) {
//                 //     if (err)
//                 //         console.log(err);
//                 //     else if (daTa == '') {
//                 //         console.log("no data found");

//                 //     } else {
//                 //         console.log("data of where to put");
//                 //         console.log(daTa);
//                 if (datttaa != null) {
//                     if (datttaa.Verified != true) {

//                         await schema.registrationn.deleteOne({
//                             emaill: delemail

//                         });
//                     }
//                 }
//                 // }
//                 // })

//             }
//         }
//     }



//     next();

// }




// Cleaning the otpcodes db (otps exceeding time limits)
// middleware
const cleanOtpdb = async (req, res, next) => {


    let count = await schema.otp.find().count();
    console.log(count);
    if (count > 0) {


        debugger
        let currentTime = new Date();

        let data = await schema.otp.find(); //collect all the sended user otp's

        // console.log(data);



        for (let user of data) { //loop over all sended otp's 
            //if the timelimit exceeds then delete that record from db

            let codeGeneratedTime = user.expireIn;
            var result = Math.abs(codeGeneratedTime - currentTime) / 1000;
            var minutes = Math.floor(result / 60) % 60;
            // console.log("<br>Difference (Minutes): " + minutes);
            if (minutes >= 2) {
                let delemail = user.email;
                // console.log(delemail);
                await schema.otp.deleteOne({
                    email: delemail

                });

                let datttaa = await schema.registrationn.findOne({
                    emaill: delemail
                });
                console.log(datttaa);
                // , async function (err, daTa) {
                //     if (err)
                //         console.log(err);
                //     else if (daTa == '') {
                //         console.log("no data found");

                //     } else {
                //         console.log("data of where to put");
                //         console.log(daTa);
                if (datttaa != null) {
                    if (datttaa.Verified == false) {

                        await schema.registrationn.deleteOne({
                            emaill: delemail

                        });
                    }
                }
                // }
                // })

            }
        }

    }

    next();

}




//verifying jwt token
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("reached auth");
    // check json web token exists & is verified.
    if (token) {
        jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/');
            } else {
                console.log(decodedToken);
                res.locals.userr = decodedToken.id;
                console.log(decodedToken.id);
                next();
            }
        })
    } else {
        alert("You need to login first");
        res.redirect('/#login');
    }
}

//email sending stuff 
const mail = async (mailDetails) => {

    let done = "Email sent successfully";
    let failed = 'Oops, there occurs some error try again';
    console.log(mailDetails);
    // const sendEmail = async(mailOptions) => {

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        secure: true,
        secureConnection: false,
        auth: {
            user: "waseemrajamca44@gmail.com",
            pass: "xzuuqffkltbtypxd"
        },
        tls: {
            rejectUnAuthorized: true
        }
    });

    let info = await transporter.sendMail(mailDetails).then((data) => alert(done)).catch((err) => {
        console.log(err);
        alert(failed);
    });
    transporter.close();
    console.log('Message Sent' + info);
    /*let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "waseemrajamca44@gmail.com",
            pass: "xzuuqffkltbtypxd"
        }
    });
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
            alert(failed);
            return failed;
            // res.status(204).send();
        } else {
            alert(done);
            return done;
            // res.status(204).send();
        }
    })*/


}


function CheckPassword(inputtxt) {

 let str= inputtxt;
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;
    if (inputtxt.match(passw)) {
        // alert('Correct, try another...')
        // if (inputtxt.includes(""))
        //     return false
        // else
            return true;
    } else {

        return false;
    }
}

module.exports = {
    // cleanOtpdbb,
    cleanOtpdb,
    requireAuth,
    mail,
    CheckPassword


};