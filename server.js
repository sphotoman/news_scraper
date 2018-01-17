const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

//listen on port
var port = process.env.PORT || 3000;
//Initialize Express
var app = express();
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

//using handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//scraping tools
const axios = require("axios");
const cheerio = require("cheerio");
var request = require("request");

// require all models
// const db =  require("./models");

// var routes = require(".routes/routes.js");
// app.use("/routes", routes);

// Middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
	useMongoClient: true
});


//routes
// app.get("/", function(req, res){
// 	// inline data
// var tester = [
//   {
//     animalType: "dog",
//     pet: true,
//     fierceness: 4
//   }, {
//     animalType: "cat",
//     pet: true,
//     fierceness: 10
//   }
// ];
// 	console.log(tester[1]);
// 	res.render("index", tester[1]);
// });

// app.get("/", function(req, res) {
//  res.send("where are my handlebars")
// });

app.get("/scrape", function(req, res){
	request("https://www.nytimes.com/", function(error, response, html){
	var $ = cheerio.load(html);

	var results = [];
	// console.log($);
	$("article.story").each(function(i, element) {
		var url =$(element).children("h2.story-heading").children("a").attr("href");
		var headline =$(element).children("h2.story-heading").children("a").text().trim();
		var summary =$(element).children("p.summary").text().trim();

		console.log(i);
		// console.log("URL for article " + url);
		// console.log("headline for Article ", headline);
		// console.log("Summary: ", summary);

		var article = {
			url: url,
			headline: headline,
			summary: summary
			};
		console.log("consolidated: ", article);
		res.render("index", article);
		});

	});	
});

// Initiate the listener.
app.listen(port);