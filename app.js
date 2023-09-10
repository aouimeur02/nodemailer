const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.APPLICATION_PORT;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.99:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var myemail = process.env.SENDER_EMAIL;
var mypassword = process.env.APPLICATION_PASSWORD;

function sendEmail({ recipient_email, OTP, name }) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: myemail,
                pass: mypassword,
            },
        });
        const mail_configs = {
            from: '4d4 <mrr6528@gmail.com>',
            to: recipient_email,
            subject: "4d4",
            html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
            <meta charset="UTF-8">
            <title>CodePen - OTP Email Template</title>
            

            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee;width:100%;display:flex;justify-content:center">
                <a href="" style="font-size:1.6em;color: #00466a;text-decoration:none;font-weight:600;">KEYS4U</a>
                </div>
                <p style="font-size:1.6em;text-align:center">Hi, ${name}</p>
                <p style="font-size:1.2em;text-align:center">Thank you for choosing KEYS4U. Use the following OTP to complete your order procedures</p>
                
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                
                <p style="font-size:0.9em;">Regards,<br />KEYS4U</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>KEYS4U Inc</p>
                </div>
            </div>
            </div>
            <!-- partial -->
            
            </body>
            </html>`,
        };
        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                console.log(error);
                return reject({ message: `An error has occured` });
            }
            return resolve({ message: "Email sent succesfuly" });
        });
    });
}

function sendkeys({ recipient_email, OTP, name, orderN }) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: myemail,
                pass: mypassword,
            },
        });
        let k = []
        for (let i = 0; i < OTP.length; i++) {
            k.push(`<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP[i]}</h2>`)
        }
        const mail_configs = {
            from: '4d4 <mrr6528@gmail.com>',
            to: recipient_email,
            subject: "4d4",
            html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
            <meta charset="UTF-8">
            <title>CodePen - OTP Email Template</title>
            

            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee;width:100%;display:flex;justify-content:center">
                <a href="" style="font-size:1.6em;color: #00466a;text-decoration:none;font-weight:600;">KEYS4U</a>
                </div>
                <p style="font-size:1.6em;text-align:center">Hi, ${name}</p>
                <p style="font-size:1.2em;text-align:center">Thank you for choosing KEYS4U. this is your key of ${orderN} your Buy it</p>
                
                ${k}
                
                <p style="font-size:0.9em;">Regards,<br />KEYS4U</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>KEYS4U Inc</p>
                </div>
            </div>
            </div>
            <!-- partial -->
            
            </body>
            </html>`,
        };
        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                console.log(error);
                return reject({ message: `An error has occured` });
            }
            return resolve({ message: "Email sent succesfuly" });
        });
    });
}


app.get("/", (req, res) => {
    sendEmail()
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

app.post("/send_recovery_email", (req, res) => {
    sendEmail(req.body)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

app.post("/keys_sender", (req, res) => {
    sendkeys(req.body)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
    console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
