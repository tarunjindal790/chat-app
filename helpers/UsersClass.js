//ES6 class

class Users{
	constructor(){
		this.users=[]
	}

	AddUserData(id,name,room){
		var user={id,name,room};
		this.users.push(user);
		return user;
	}

	RemoveUser(id){
		
		var user=this.GetUser(id);
		//if the user exist then filter all elements except the one
		//that is to be removed
		if(user){
			this.users=this.users.filter((user)=>user.id!==id);
		}
		return user;
	}

	GetUser(id){
		//filters user with given id and return 0th value i.e socketid of the user
		var getUser=this.users.filter((users)=>{
			return users.id===id;
		})[0];
		return getUser;
	}

	GetUserList(room){

		//.filter creates new array with the condition provided
		var users=this.users.filter((user)=>{
			return user.room===room;
		})
		//.map creates new array with only the required columns
		var namesArray=users.map((user)=>{
			return user.name
		})
		return namesArray;
	}
}

module.exports={Users}