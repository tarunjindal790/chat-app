var express=require("express");
var router=express.Router();
var multer=require("multer");
var cloudinary=require('cloudinary');
var mongoose=require('mongoose');
var keys=require('../config/keys')

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
	Room.find({},function(err,allRooms){
		res.render("rooms",{rooms:allRooms})
	})
})

router.get("/add",function(req,res){
	res.render("addRoom")
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

// router.post("/")

router.get("/:room",function(req,res){
	
	res.render("rooms");
})


module.exports=router;