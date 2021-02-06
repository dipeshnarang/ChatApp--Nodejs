const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const {generateMessage,locationMessage}=require('./utils/messages')
const {addUser, getUser, removeUser, getUsersInRoom}=require('./utils/users')

const app=express()
const server= http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000

const publicDirectoryname=path.join( __dirname , '../public')

//app.use(express.json())
app.use(express.static(publicDirectoryname))

let count=0

io.on('connection', (socket)=>
{
    
    socket.on('join',({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id, username:username, room:room})

        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message',generateMessage(`Welcome!`,{username:'Admin'}))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`,{username:'Admin'}))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })

    socket.on('inputMsg',(msg,callback)=>{
        const user=getUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(msg,user))
            callback()

        }
    })

    // socket.emit('message',generateMessage('Welcome!',))

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left`,user))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })

    socket.on('shareLocation',(curPosition,callback)=>{
        const user=getUser(socket.id)
        // socket.broadcast.emit('message',`New User has joined with latitute ${curPosition.lat} and longitude ${curPosition.long}`)
        if(user){
            io.emit('locationMessage',locationMessage(curPosition,user))
            callback('location shared') 
        }
    })
}) 


server.listen( port , ()=>
{
    console.log('listening on port : ' +port)
})
