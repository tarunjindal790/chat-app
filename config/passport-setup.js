var passport=require("passport");
var GoogleStrategy=require("passport-google-oauth").OAuth2Strategy;
var keys=require("./keys");

//db models
var User=require("../models/user");

passport.serializeUser((user,done)=>{
	done(null,user.id);
})

passport.deserializeUser((id,done)=>{
	User.findById(id).then((user)=>{
		done(null,user);
	})
})


passport.use(new GoogleStrategy({
	clientID: keys.google.clientID,
	clientSecret: keys.google.clientSecret,
	callbackURL: "/auth/google/redirect"
},
function(accessToken, refreshToken, profile, done) {
       console.log(profile);
       User.findOne({googleId:profile.id},function(err,user){
       	if(!user){
                   user=new User({
                        username:profile.emails[0].value,
                        googleId:profile.id,
                        thumbnail:profile._json.picture,
                        email:profile.emails[0].value,
                        fullname:profile.displayName
                   });
                   user.save(function(err){
                        if(err){
                              console.log(err);
                        }
                        console.log(user);
                        return done(err,user);
                         
                   });
             }else{
                   console.log(user);
                   return done(err,user);
             }
       		
       });
       
   }
   ));
