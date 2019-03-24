//jshint esversion:6
const express = require("express");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/classes", function(req, res){
  res.render("classes");
});

app.get("/faq", function(req, res){
  res.render("faq");
});

app.get("/events", function(req, res){
  res.render("events");
});

app.get("/teachers", function(req, res){
  res.render("teachers");
});

app.get("/contact-us", function(req, res){
  res.render("contact-us");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
