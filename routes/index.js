var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
	res.render("index");
})

//AUTH ROUTES

router.get("/register",function(req,res){
	res.render("register");
})

router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to my chat app "+user.username);
			res.redirect("/");
		})
	})
})

//LOGIN

router.get("/login",function(req,res){
	
	res.render("login");
});
router.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){

});

//LOGOUT
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You have been logged out.");
	res.redirect("/");
})

router.get("*",function(req,res){
	res.send("You have reached a mysterious page! You will die in 7 days. :3")
})


module.exports=router;