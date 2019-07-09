var express=require("express");
var router=express.Router();
var User=require('../models/user');
var async=require('async');

//index routes
router.get("/",function(req,res){
	async.parallel([
		
		function(callback){
			if(req.user){
			console.log(req.user);
			User.findOne({'username':req.user.username})
			.populate('request.userId')
			.exec((err,result)=>{
				callback(err,result);
			})	
			}else{
				res.render("index");
			}	
		}
		],(err,results)=>{
			var result1=results[0];
			console.log(result1);
			res.render("index",{data:result1});
		});

	// res.render("index");
})


// router.get("*",function(req,res){
// 	res.send("You have reached a mysterious page! You will die in 7 days. :3")
// })


module.exports=router;