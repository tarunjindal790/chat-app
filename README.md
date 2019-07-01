# chat-app
A web based chat application built on Nodejs,SocketIO and MongoDB.WIP.

Use npm install to set up.

To set up google auth:
	1. Create a file named keys.js in config folder
	2. Insert this as content

		module.exports={
		google:{
			clientID:"your client id here",
	    	clientSecret: "your client secret here",
		},
		session:{
			cookieKey:'use any sentence of your choice'
		}
	}

	3. Register a application with google developer console. https://console.developers.google.com/
	
	4.Enable Google+ api and create credentials.

	5.Fill in details for Oauth consent screen.Use http://localhost:3000/auth/google/redirect as Authorized redirect URIs.

	6.Generate clientId and clientSecret and insert them in the created "keys.js"