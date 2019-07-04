$(document).ready(function(){
	//possible since we included socketio in roomChat.ejs
	var socket=io();
	var room=$('#roomName').val();
	var sender=$('#sender').val();
	//0. checks connection on client side
	socket.on('connect',function(){
		console.log("User connected",room);
		var params={
			room:room
		}
		//1.emits join event to server
		socket.emit('join',params,function(){
			console.log("User has joined ");
		})

	})



	//5. Get the data from newMessage and insert it into ejs on
	// client side chat area using mustache template rendering  
	socket.on('newMessage',function(data){
		console.log(data);
		var template=$('#message-template').html();
		var message=Mustache.render(template,{
			text:data.text,
			sender:data.from,

		});

		$('#messages').append(message);
	})

	//3.Submit message and user data to server with createMessage event 
	$('#message-form').on('submit',function(e){
		e.preventDefault();
		var msg=$('#msg').val();
		socket.emit('createMessage',{
			text:msg,
			room:room,
			sender:sender
		},function(){
			$('#msg').val('');
		})
	})


});