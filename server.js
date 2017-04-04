/************************/
/*      COMP2406 A4     */
/*     Author: Jess     */
/*    S/N: 101007447 	 	*/
/************************/

var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var hat = require('hat');
var cookieParser = require('cookie-parser');

var db;

app.set('views','./views');
app.set('view engine','pug');

//function executed every time the app object receives a request
app.use(express.static("./public"));

app.get("/recipes", function(req, res) {
	mongo.connect("mongodb://localhost:27017/recipeDB",function(err,database){
		if(err)throw err;
		app.listen(2406,function(){console.log("Server is alive!!");});
		db = database; //store the connection (pool)
	});
});

app.use("/recipe",bodyParser.urlencoded({extended:true}));

app.post("/recipe", function(req, res) {
	var recipe;

	// console.log(req.body);
	db.collection("recipeDB").insert(recipe, function(err, result) {
		if (err) res.sendStatus(500); //internal server error/
		// else if () //400, data missing
		else res.sendStatus(200); //OK, success.
	});
});

app.use(function(req,res,next){
	console.log(req.method+" request for "+req.url);
	next();
});

app.use(cookieParser());
//serve main page + credentials
app.get("/", function(req,res){

	res.render('index');

});

app.listen(2406,function(){console.log("Server listening on port 2406");});

function recipe(name, duration, ingredients, directions, notes) { //create a recipe obj
	this.name = name;
	this.duration = duration;
	this.ingredients = ingredients;
	this.directions = directions;
	this.notes = notes;
}
