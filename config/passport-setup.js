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
       // User.Create({ googleId: profile.id }, function (err, user) {
       //   return done(err, user);
       // });
       console.log(profile);
       User.findOne({googleId:profile.id}).then((currentUser)=>{
       	if(currentUser){
       		console.log("user is:",currentUser);
       		done(null,currentUser);
       	}
       	else{
       		new User({
       			username:profile.displayName,
       			googleId:profile.id,
                        thumbnail:profile._json.picture
       		}).save().then((newUser)=>{
       			console.log("new user",newUser);
       			done(null,newUser);
       		});		
       	}
       });
       
   }
   ));
