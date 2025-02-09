//jshint esversion:8
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const request = require("request");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

var ctx = {
  stripe_uri: process.env.STRIPE_SERVICE_URI,
  stripe_pk: process.env.STRIPE_PUBLISHABLE_KEY,
};

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

app.get("/", function (req, res) {
  res.render("home", ctx);
});

app.get("/classes", function (req, res) {
  res.render("classes", ctx);
});

app.get("/faq", function (req, res) {
  res.render("faq", ctx);
});

app.get("/events", function (req, res) {
  res.render("events", ctx);
});

app.get("/swingvasion", function (req, res) {
  res.render("swingvasion", ctx);
});

app.get("/swingvasion-merch-cc", function (req, res) {
  res.render("swingvasion_cc", ctx);
});

app.get("/swingvasion-competition-rules", function (req, res) {
  res.render("swingvasion-competition-rules", ctx);
});

app.get("/swingvasion-schedule", function (req, res) {
  res.render("swingvasion-schedule", ctx);
});

app.get("/swingvasion-code-of-conduct", function (req, res) {
  res.render("swingvasion-etiquette-code-of-conduct", ctx);
});

app.get("/contact-us", function (req, res) {
  res.render("contact-us", ctx);
});

app.get("/teachers", function (req, res) {
  res.render("teachers", ctx);
});

app.post("/send-email", function (req, res) {
  // Recaptcha validation
  if (
    req.body["g-recaptcha-response"] === undefined ||
    req.body["g-recaptcha-response"] === "" ||
    req.body["g-recaptcha-response"] === null
  ) {
    res.redirect("/error");
  }

  const verificationURL =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    RECAPTCHA_SECRET +
    "&response=" +
    encodeURI(req.body["g-recaptcha-response"]) +
    "&remoteip=" +
    req.connection.remoteAddress;

  request(verificationURL, function (error, response, body) {
    body = JSON.parse(body);

    // If recaptcha has not been ticked
    if (body.success !== undefined && !body.success) {
      return res.json({
        responseError: "Failed captcha verification",
      });
    }

    // If recaptcha has been ticked, then send the email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_ADDRESS,
        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
        expires: Number.parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE, 10),
      },
    });

    const mailOptions = {
      // to: "swingcentral@goddard.nz",
      to: "cherisetan@live.com",
      subject: req.body.subject,
      html:
        "From: " +
        req.body.name +
        ". <br> Email: " +
        req.body.email +
        ". <br>" +
        req.body.message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.redirect("/error");
        return console.log(error);
      }
      if (200) {
        res.redirect("/success");
        console.log("Message %s sent: %s", info.messageId, info.response);
      }
    });
  });
});

app.get("/success", function (req, res) {
  res.render("email-success", ctx);
});
app.get("/error", function (req, res) {
  res.render("email-error", ctx);
});

app.get("/payment-success", function (req, res) {
  res.render("payment-success", ctx);
});
app.get("/payment-error", function (req, res) {
  res.render("payment-error", ctx);
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
