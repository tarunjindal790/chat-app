var express=require("express");
var router=express.Router();

var passport=require("passport");
var GoogleStrategy=require("passport-google-oauth").Oauth2Stategy;
var passportSetup=require("../config/passport-setup");

//db models
var User=require("../models/user");

//AUTH ROUTES

router.get("/register",function(req,res){
	res.render("register");
})

router.post("/register",function(req,res){
	var newUser=new User({
		username:req.body.username,
		fullname:req.body.username
	});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		// console.log(user);
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to my chat app "+user.username);
			res.redirect("/");
		})
	})
})

//LOGIN

router.get("/login",function(req,res){
	// res.send("hey")
	res.render("login");
});
router.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/auth/login"
}),function(req,res){

});

//google auth
router.get("/google",passport.authenticate('google',{
	scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.email']
}));

router.get('/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile/');
  });



//LOGOUT
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You have been logged out.");
	res.redirect("/");
})

module.exports=router;
