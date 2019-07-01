var express=require("express");
var router=express.Router();



//index routes
router.get("/",function(req,res){
	res.render("index");
})


// router.get("*",function(req,res){
// 	res.send("You have reached a mysterious page! You will die in 7 days. :3")
// })


module.exports=router;