const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const {generateMessage,locationMessage}=require('./utils/messages')


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
    // console.log('new connection')

    socket.emit('countUpdated',count)
    // socket.broadcast.emit('message',generateMessage('New User has joined!'))
    
    socket.on('join',({username,room})=>{
        socket.join(room)
        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined!`))

    })

    socket.on('increment' ,()=>
    {
        count++;
        // socket.emit('countUpdated',count)
        io.emit('countUpdated',count)

        
    })

    socket.on('inputMsg',(msg,callback)=>{
         
        io.emit('message',generateMessage(msg))
        callback()
    })

    socket.emit('message',generateMessage('Welcome!'))

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left'))
    })

    socket.on('shareLocation',(curPosition,callback)=>{
        
        // socket.broadcast.emit('message',`New User has joined with latitute ${curPosition.lat} and longitude ${curPosition.long}`)
        io.emit('locationMessage',locationMessage(curPosition))
        callback('location shared')
    })
}) 


server.listen( port , ()=>
{
    console.log('listening on port : ' +port)
})
