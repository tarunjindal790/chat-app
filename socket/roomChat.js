module.exports=function(io){
	
	//connection event check for connection of a socket
	io.on('connection',(socket)=>{
		console.log("User is connected");

		socket.on('join',(params,callback)=>{
			socket.join(params.room);
			callback();
		})

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