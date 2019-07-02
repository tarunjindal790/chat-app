var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
	username:{type:String,required:true},
	password:{type:String,default:null},
	googleId:{type:String,default:null},
	thumbnail:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);