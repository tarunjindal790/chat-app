var express=require("express");
var router=express.Router();
var multer=require("multer");
var cloudinary=require('cloudinary');
var mongoose=require('mongoose');
var keys=require('../config/keys');
var User=require('../models/user');
var async=require('async');

var Room=require('../models/room');


//for image upload feature
var storage=multer.diskStorage({
	filename:function(req,file,callback){
		callback(null,Date.now()+file.originalname);
	}
});
var imageFilter=function(req,file,cb){
	if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/i)){
		return cb(new Error('Only image files are allowed'),false)
	}
	cb(null,true);
};
var upload=multer({storage:storage,fileFilter:imageFilter});
cloudinary.config({
	cloud_name:'timecapsule',
	api_key:keys.cloudinary.CLOUDINARY_API_KEY,
	api_secret:keys.cloudinary.CLOUDINARY_API_SECRET

});


router.get("/",function(req,res){
	async.parallel([
		function(callback){
				if(req.user){
					User.findOne({'username':req.user.username})
					.populate('request.userId')
					.exec((err,result)=>{
						callback(err,result);
					})	
				}
		},

		function(callback){
			Room.find({},function(err,allRooms){
				callback(err,allRooms);
			})
		}
		],(err,results)=>{
			var result1=results[0];
			var allRooms=results[1];
			res.render("rooms",{rooms:allRooms,data:result1});
		})
	// Room.find({},function(err,allRooms){
	// 	res.render("rooms",{rooms:allRooms})
	// })
})

router.post("/",function(req,res){
	async.parallel([
			function(callback){
				 Room.updateOne({
				 	'_id':req.body.id,
				 	'members.username':{$ne:req.user.username}
				 },{
				 	$push:{members:{
				 		username:req.user.username,
				 		email:req.user.email
				 	}}
				 },(err,count)=>{
				 	console.log(count);
				 	callback(err,count);
				 }
				 )
			}
		],(err,results)=>{
				 	console.log(results);
				 	res.redirect('/rooms');
				 });
})

router.get("/add",function(req,res){
	async.parallel([
		function(callback){
			if(req.user){


			User.findOne({'username':req.user.username})
			.populate('request.userId')
			.exec((err,result)=>{
				callback(err,result);
			})
		}else{
			res.render("addRoom");
		}
		}
		],(err,results)=>{
			var result1=results[0];
			// console.log(result1);
			res.render("addRoom",{data:result1});
		});
	
})

router.post("/",upload.single('roomImage'),function(req,res){
	
	var roomName=req.body.roomName;
	Room.findOne({roomName:roomName},function(err,currentRoom){
		if(currentRoom){
			console.log("Room already exist")
			console.log("Room is ",currentRoom)
		}else{
			var imageUrl;
			cloudinary.v2.uploader.upload(req.file.path,function(err,result){
				imageUrl=result.secure_url;
				console.log(imageUrl);
				newRoom=({
					roomName:req.body.roomName,
					language:req.body.roomLanguage,
					image:imageUrl,

				})
				Room.create(newRoom,function(err,newRoom){
					console.log(newRoom);
					res.redirect("/rooms/");
				})


			})		

		}
	})

})


router.post("/:room",function(req,res){
	async.parallel([
		function(callback){
			if(req.body.receiverName){
				User.findOneAndUpdate({
					$and:[{
						'username':req.body.receiverName,
						'request.username':{$ne:req.user.username},
						'friendList.friendName':{$ne:req.user.username}
					}]
					
				},
				{
					$push:{request:{
						userId:req.user._id,
						username:req.user.username
					}},
					$inc:{totalRequest:1}
				},(err,count)=>{
					callback(err,count);
				})
			}
		},
		function(callback){
			if(req.body.receiverName){
				User.findOneAndUpdate({
					'username':req.user.username,
					'sentRequest.username':{$ne:req.body.receiverName}
				},
				{
					$push:{sentRequest:{
						username:req.body.receiverName
					}}
				},(err,count)=>{
					callback(err,count);
				})
			}
		}
		],(err,results)=>{
			res.redirect('/rooms/'+req.params.name);
		});

	async.parallel([
		function(callback){
			if(req.body.senderId){
				User.findOneAndUpdate({
					'_id':req.user._id,
					'friendsList.friendName':{$ne:req.body.senderName}
				},{
					$push:{friendsList:{
						friendId:req.body.senderId,
						friendName:req.body.senderName
					}},
					$pull:{request:{
						userId:req.body.senderId,
						username:req.body.senderName
					}},
					$inc:{totalRequest:-1}
				},(err,count)=>{
					callback(err,count);
				})
			}
		},
		function(callback){
			if(req.body.senderId){
				User.findOneAndUpdate({
					'_id':req.body.senderId,
					'friendsList.friendName':{$ne:req.user.username}
				},{
					$push:{friendsList:{
						friendId:req.user._id,
						friendName:req.user.username
					}},
					$pull:{sentRequest:{
						username:req.user.username
					}},
				},(err,count)=>{
					callback(err,count);
				});
			}
		},
		function(callback){
			if(req.body.user_Id){
				User.findOneAndUpdate({
					'_id':req.user_Id,
					'request.userId':{$eq:req.body.user_Id}
				},{
					$pull:{request:{
						userId:req.body.user_Id
					}},
					$inc:{totalRequest:-1}
				},(err,count)=>{
					callback(err,count);
				});			
			}
		},
		function(callback){
			if(req.body.user_Id){
				User.findOneAndUpdate({
					'_id':req.body.user_Id,
					'sentRequest.username':{$eq:req.user.username}
				},{
					$pull:{sentRequest:{
						username:req.user.username
					}}
				},(err,count)=>{
					callback(err,count);
				});			
			}
		}
		],(err,results)=>{
			res.redirect('/rooms/'+req.params.name);
		})

})

router.get("/:room",function(req,res){
	async.parallel([
		function(callback){
			User.findOne({'username':req.user.username})
			.populate('request.userId')
			.exec((err,result)=>{
				callback(err,result);
			})
		}
		],(err,results)=>{
			var result1=results[0];
			console.log(result1);
			res.render("roomChat",{user:req.user,room:req.params.room,data:result1});
		});
});



module.exports=router;