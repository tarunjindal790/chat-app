var express=require("express");
var router=express.Router();
var User=require('../models/user');
var async=require('async');

var authCheck=(req,res,next)=>{
	if(!req.user){
		//if not logged in
		res.redirect('/auth/login');
	}else{
		next();
	}
}


router.get("/",authCheck,(req,res)=>{

	async.parallel([
		function(callback){
			if(req.user){
				User.findOne({'username':req.user.username})
			.populate('request.userId')
			.exec((err,result)=>{
				callback(err,result);
			})	
			}else{
				res.render("profile",{user:req.user})
			}
			
		}
		],(err,results)=>{
			var result1=results[0];
			// console.log(result1);
				res.render("profile",{user:req.user,data:result1});
		});
	// res.render("profile",{user:req.user})
})

module.exports=router;