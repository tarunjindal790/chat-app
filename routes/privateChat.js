var express=require("express");
var router=express.Router();
var async=require('async');
var User=require('../models/user');
var Message=require('../models/message');

router.get('/:name', (req,res)=>{

	async.parallel([
		function(callback){
			

				User.findOne({'username':req.user.username})
				.populate('request.userId')
				.exec((err,result)=>{
					callback(err,result);
				})
			
		},

		function(callback){
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

			
		},
		function(callback){
			Message.find({'$or':[{'senderName':req.user.username}, 
				{'receiverName':req.user.username}]})
				.populate('sender')
				.populate('receiver')
				.exec((err, result3) =>{
					callback(err, result3)
				})
		}
		],(err,results)=>{
			var result1=results[0];
			var result2=results[1];
			var result3=results[2];

			console.log(result3);

			var params = req.params.name.split('.');
	        var nameParams = params[0];
			// console.log(result1);
			res.render("privateChat",{title:'Tandem - Private Chat',user:req.user, data:result1, chat:result2, chats:result3, name:nameParams});
		});

})


router.post('/:name',(req,res, next)=>{
	var params = req.params.name.split('.');
	var nameParams = params[0];
	var nameRegex = new RegExp("^"+nameParams.toLowerCase(), "i");

	async.waterfall([
		function(callback){
			if(req.body.message){
				User.findOne({'username': {$regex: nameRegex}}, (err, data)=> {
					callback(err, data);
				});
			}
		},
		function(data, callback){
			if(req.body.message){
				var newMessage = new Message();
				newMessage.sender = req.user._id;
				newMessage.receiver = data._id;
				newMessage.senderName = req.user.username;
				newMessage.receiverName = data.username;
				newMessage.message = req.body.message;
				newMessage.userImage = req.user.thumbnail;
				newMessage.createdAt = new Date();

				newMessage.save((err, result)=>{
					if(err){
						return next(err);
					}
					// console.log(result);
					callback(err, result);
				})
			}
		}



		
		], (err, rresults)=>{
			res.redirect('/'+req.params.name);
		});


	async.parallel([
		function(callback){
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
		}
	], (err, rresults)=>{
			res.redirect('/'+req.params.name);
		});


});






module.exports=router;