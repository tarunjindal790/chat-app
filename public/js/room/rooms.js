$(document).ready(function($) {
	$('#member').on('submit',function(e){
		e.preventDefault();
		var id=$("#id").val();
		var roomName=$("#roomName").val();

		$.ajax({
			url:'/rooms/',
			type:'POST',
			data:{
				id:id,
				roomName:roomName	
			},
			success:function(){
				console.log(roomName);
			}
		})
	})

})