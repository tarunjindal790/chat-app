var express=require("express");
var router=express.Router();
var User=require('../models/user');
var async=require('async');
var Message=require('../models/message');

//index routes
router.get("/",function(req,res){
	async.parallel([
		
		function(callback){
			if(req.user){
			// console.log(req.user);
			User.findOne({'username':req.user.username})
			.populate('request.userId')
			.exec((err,result)=>{
				callback(err,result);
			})	
			}else{
				res.render("index");
			}	
		}, function(callback){
			var nameRegex = new RegExp("^"+req.user.username.toLowerCase(), "i");

			Message.aggregate([

				{$match:{$or:[{'senderName':nameRegex},
				{'receiverName':nameRegex}]}},
				{$sort:{'createdAt':-1}},
				{
					$group:{"_id":{
						"last_message_between":{
							$cond:[
							{
								$gt:[
								{"$substr":["$senderName",0,1]}, 
								{"$substr":["$receiverName",0,1]}]
							},
							
							{$concat:["$senderName"," and ","$receiverName"]},
							{$concat:["$receiverName"," and ","$senderName"]}
							
							]
						}
					}, "body":{$first:"$$ROOT"}
				}
			
			}], function(err, newResult){
				callback(err, newResult);
			}
			);

			
		}
		],(err,results)=>{
			var result1=results[0];
			var result2=results[1];

			// console.log(result1);
			res.render("index",{data:result1,user:req.user,chat:result2});
		});

	// res.render("index");
})



router.post("/",function(req,res,callback){



		
			if(req.body.chatId){
				Message.update({
					'_id':req.body.chatId
				},
				{
					"isRead": true
				}, (err, done) =>{
					console.log(done);
					callback(err, done);
				})
			}
		
	});


// router.get("*",function(req,res){
// 	res.send("You have reached a mysterious page! You will die in 7 days. :3")
// })


module.exports=router;