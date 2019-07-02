# chat-app
A web based chat application built on Nodejs,SocketIO and MongoDB.WIP.

Use npm install to set up.

To set up google auth:

	1. Remove -demo from file name in config folder.

	2. Register an application with google developer console. https://console.developers.google.com/
	
	3.Enable Google+ api and create credentials.

	4.Fill in details for Oauth consent screen.Use http://localhost:3000/auth/google/redirect as Authorized redirect URIs.

	5.Generate clientId and clientSecret and insert them in the created "keys.js"


To set up cloudinary:

	1. Create an account on cloudinary
	
	2. Obtain the api key and secret and insert them in keys.js file.