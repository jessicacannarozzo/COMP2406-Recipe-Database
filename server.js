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

//send recipe list
app.get("/recipes", function(req, res) {
	recipeList.names = [];
	res.writeHead(200, {"Content-Type" : 'application/json'});
	mongo.connect("mongodb://localhost:27017/recipeDB",function(err,database){
		if(err)throw err;
		db = database; //store the connection (pool)
		db.collection("recipes").find().each(function(err, u) {
			if (!u) {
				db.close();
				res.end(JSON.stringify(recipeList));
			} else recipeList.names.push(u.name);
		});
	});
});

app.use("/recipe",bodyParser.urlencoded({extended:true}));

//post/save a new recipe
app.post("/recipe", function(req, res) {
	var recipe = new Recipe(req.body.name, req.body.duration, req.body.ingredients, req.body.directions, req.body.notes);

	mongo.connect("mongodb://localhost:27017/recipeDB",function(err,db){
		if(err)throw err;
		db.collection("recipes").update({name:req.body.name},req.body,{upsert:true, w: 1}, function(err, result) {
			if (err) res.sendStatus(500); //internal server error/
			// else if () //400, data missing
			else res.sendStatus(200); //OK, success.
			db.close();
		});
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

function Recipe(name, duration, ingredients, directions, notes) { //create a recipe obj
	this.name = name;
	this.duration = duration;
	this.ingredients = ingredients;
	this.directions = directions;
	this.notes = notes;
}
