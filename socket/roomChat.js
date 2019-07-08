


module.exports=function(io){
	var {Users}=require("../helpers/UsersClass");
	var users=new Users();
	
	//0. connection event check for connection of a socket
	io.on('connection',(socket)=>{
		console.log("User is connected");
		//2.join the user to room and call console log 
		socket.on('join',(params,callback)=>{
			socket.join(params.room);
			//using helpers/UserClass.js functions
			users.AddUserData(socket.id,params.sender,params.room);
			io.to(params.room).emit('onlineUsersList',users.GetUserList(params.room));
			console.log(users);
			callback();
		})

		//4. Listen for createMessage and transmit this message data
		// to all users in same room through newMessage event
		socket.on('createMessage',(message,callback)=>{
			console.log(message);
			//io.to sends event to all users including itself
			io.to(message.room).emit('newMessage',{
				text:message.text,
				room:message.room,
				from:message.sender
			});
			callback();
		})

		socket.on('disconnect',()=>{
			var user=users.RemoveUser(socket.id);
			if(user){
			io.to(user.room).emit('onlineUsersList',users.GetUserList(user.room));
			}
		})

	})



}