var express=require("express");
var router=express.Router();
var authCheck=(req,res,next)=>{
	if(!req.user){
		//if not logged in
		res.redirect('/auth/login');
	}else{
		next();
	}
}


router.get("/",authCheck,(req,res)=>{
	res.render("profile",{user:req.user})
})

module.exports=router;