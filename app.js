'use strict';

var express 	    =require('express');
var app  			=express();
var path 			=require('path')
var bodyParser 		=require('body-parser');
var http 			=require('http');
var async 			=require('async');
var flash 			=require("connect-flash");
var socketIO 		=require('socket.io');
var passport 	    =require("passport");
var LocalStrategy   =require("passport-local");
var cookieSession 	=require("cookie-session");
var keys 			=require("./config/keys");
var mongoose 		=require("mongoose");
var User 			=require("./models/user");
var Room 			=require("./models/room");


var server=http.createServer(app);
var io=socketIO(server);
require('./socket/roomChat')(io);
require('./socket/friend')(io);

// To remove all rooms/users
// User.remove({},function(err){
// 	console.log("Removed all users")
// })

app.use(flash());
app.use(cookieSession({
	maxAge:24*60*60*1000,
	keys:[keys.session.cookieKey]
}))
//db setup

mongoose.connect("mongodb://localhost/chat_app");

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"This app is going to be amazing",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

//require routes
var indexRoutes=require('./routes/index');
var authRoutes=require('./routes/auth');
var roomRoutes=require('./routes/rooms')
var profileRoutes=require('./routes/profile')
// Set the port number
var port = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


//routes setup
app.use("/",indexRoutes)
app.use("/auth",authRoutes)
app.use("/rooms",roomRoutes)
app.use("/profile",profileRoutes)


server.listen("3000", function(){
   console.log("Server has started on port 3000!");
});