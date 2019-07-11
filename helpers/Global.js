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

	RemoveUser(id){
		
		var user=this.GetUser(id);
		//if the user exist then filter all elements except the one
		//that is to be removed
		if(user){
			this.users=this.globalRoom.filter((user)=>user.id!==id);
		}
		return user;
	}

	GetUser(id){
		//filters user with given id and return 0th value i.e socketid of the user
		var getUser=this.globalRoom.filter((users)=>{
			return users.id===id;
		})[0];
		return getUser;
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