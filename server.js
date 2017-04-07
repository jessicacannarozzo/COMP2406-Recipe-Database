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

var recipeList = {};
recipeList.names = [];

app.set('views','./views');
app.set('view engine','pug');

//function executed every time the app object receives a request
app.use(express.static("./public"));
app.use("/recipe",bodyParser.urlencoded({extended:true}));


mongo.connect("mongodb://localhost:27017/recipeDB",function(err,database){
	if(err)throw err;
	app.listen(2406,function(){console.log("Server is alive!!");});
	db = database; //store the connection (pool)
});

//send recipe list
app.get("/recipes", function(req, res) {
	recipeList.names = [];
	res.writeHead(200, {"Content-Type" : 'application/json'});
	db.collection("recipes").find().each(function(err, u) {
		if (!u) {
			res.end(JSON.stringify(recipeList));
		} else recipeList.names.push(u.name); //add to option menu
	});
});

app.get("/recipe/:name", function(req, res) {
	db.collection("recipes").findOne({name: req.params.name}, function(err, recipe) {
		if (err) res.sendStatus(500);
		if (!recipe) res.sendStatus(404);
		console.log(JSON.stringify(recipe));
		res.writeHead(200, {"Content-Type" : 'application/json'});
		res.end(JSON.stringify(recipe));
	});
});

//post/save a new recipe
app.post("/recipe", function(req, res) {
	var recipe = Recipe(req.body);

	db.collection("recipes").update({name: recipe.name}, recipe,{upsert:true, w: 1}, function(err, result) {
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

function Recipe(options) { //create a recipe obj
	return {
		name: options.name,
		duration: options.duration,
		ingredients: options.ingredients,
		directions: options.directions,
		notes: options.notes
	}
}
