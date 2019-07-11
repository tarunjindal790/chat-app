var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
	username:{type:String,required:true},
	password:{type:String,default:null},
	googleId:{type:String,default:null},
	thumbnail:{type:String,default:'default.png'},
	email:{type:String,default:null},
	fullname:{type:String,default:null},
	sentRequest:[{
		username:{type:String,default:null}
	}],
	request:[{
		userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
		username:{type:String,default:null}
	}],
	friendsList:[{
		friendId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
		friendName:{type:String,default:''}
	}],
	totalRequest:{type:Number,default:0}
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);