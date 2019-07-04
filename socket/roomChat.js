module.exports=function(io){
	
	//0. connection event check for connection of a socket
	io.on('connection',(socket)=>{
		console.log("User is connected");
		//2.join the user to room and call console log 
		socket.on('join',(params,callback)=>{
			socket.join(params.room);
			callback();
		})

		//4. Listen for createMessage and transmit this message data
		// to all users in same room through newMessage event
		socket.on('createMessage',(message,callback)=>{
			console.log(message);
			io.to(message.room).emit('newMessage',{
				text:message.text,
				room:message.room,
				from:message.sender
			});
			callback();
		})
	})



}