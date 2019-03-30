//jshint esversion:8
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const {
  google
} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/classes", function(req, res) {
  res.render("classes");
});

app.get("/faq", function(req, res) {
  res.render("faq");
});

app.get("/events", function(req, res) {
  res.render("events");
});

app.get("/contact-us", function(req, res) {
  res.render("contact-us");
});

app.post('/send-email', function(req, res) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_ADDRESS,
      clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
      clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
      expires: Number.parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE, 10),
    },
  });

  const mailOptions = {
    to: "*******@gmail.com",
    subject: req.body.subject,
    html: "From: " + req.body.name + ". <br> Email: " + req.body.email + ". <br>" + req.body.message, //comg through atm
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (err) {
      res.redirect("/error");
      return console.log(error);
    }
    res.redirect("/success");
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
});

app.get("/success", function(req, res) {
  res.render("email-success");
});
app.get("/error", function(req, res) {
  res.render("email-error");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
