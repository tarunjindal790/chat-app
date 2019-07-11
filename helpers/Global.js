//ES6 class

class Global{
	constructor(){
		this.globalRoom=[]
	}

	EnterRoom(id,name,room,img){
		var user={id,name,room,img};
		this.globalRoom.push(user);
		return user;
	}



	GetRoomList(room){

		//.filter creates new array with the condition provided
		var roomName=this.globalRoom.filter((user)=>{
			return user.room===room;
		})
		//.map creates new array with only the required columns
		var namesArray=roomName.map((user)=>{
			return{
				name:user.name,
				img:user.img
			}
		})
		return namesArray;
	}
}

module.exports={Global}