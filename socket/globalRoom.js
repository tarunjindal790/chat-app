

module.exports=function(io,Global,_){
	var clients=new Global();

	io.on('connection',(socket)=>{
		socket.on('global room',(global)=>{
			socket.join(global.room);
			clients.EnterRoom(socket.id,global.name,global.room,global.img);
			var nameProp=clients.GetRoomList(global.room);
			var arr=_.uniqBy(nameProp,'name');

			io.to(global.room).emit('loggedInUser',arr); 
		});
	
	socket.on('disconnect',()=>{
		var user=clients.RemoveUser(socket.id);
		if(user){
			var userData=clients.GetRoomList(user.room);
			var arr=_.uniqBy(userData,'name');
			var removeData=_.remove(arr,{'name':user.name});
			io.to(user.room).emit('loggedInUser',arr);

		}
	})

	});
}