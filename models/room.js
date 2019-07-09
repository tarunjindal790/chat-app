var mongoose  = require('mongoose');

var RoomSchema=new mongoose.Schema({
	roomName:{type:String,required:true},
	language:String,
	image:String,
	members:[{
		username:String,
		email:String
	}],
	members:[{
		username:String,
		email:String
	}]

})


module.exports=mongoose.model("Room",RoomSchema);