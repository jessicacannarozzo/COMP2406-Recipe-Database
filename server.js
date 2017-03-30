/************************/
/*      COMP2406 A4     */
/*     Author: Jess     */
/*    S/N: 101007447 	 	*/
/************************/


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var hat = require('hat');
var cookieParser = require('cookie-parser');

app.set('public','./public');
app.set('view engine','pug');


app.use(function(req,res,next){
	console.log(req.method+" request for "+req.url);
	next();
});

app.use(cookieParser());
//serve main page + credentials
app.get(['/', '/index.html', '/home', '/index'], function(req,res){

	res.render('index',{});

});

//
// //serve user login page
// app.get('/login', function(req,res){
// 	res.render('login');
// });



// //handle user login
// app.post('/login', function(req,res){
// 	//stub
// 	res.sendStatus(501); //not implemented
// });

app.listen(2406,function(){console.log("Server listening on port 2406");});
