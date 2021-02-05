const users=[]

const addUser=({id, username, room})=>{
    
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:'Username and room are required'
        }
    }

    const existingUser  
}