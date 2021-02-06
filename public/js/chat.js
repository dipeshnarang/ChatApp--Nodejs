const socket=io()

//Elements 
const $formElement=document.querySelector('#message-form')
const $inputElement=$formElement.querySelector('input')
const $submitButton=$formElement.querySelector('button')
const $shareLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')


//Templates
const $messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//Query String
const {username, room}=Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoscroll=function(){
    //Last Element
    const newMessage=$messages.lastElementChild

    //Last Element Properties
    const newMessageStyel=getComputedStyle(newMessage)
    const newMessageHeight=newMessage.offsetHeight

}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render($messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(location)=>{
    console.log(location)
    const html=Mustache.render(locationMessageTemplate,{
        username:location.username,
        location:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


$formElement.addEventListener('submit',(e)=>{
    e.preventDefault()
    $submitButton.setAttribute('disabled','disbaled')
    $inputElement.focus()
    const inputMsg=e.target.elements.message.value
    socket.emit('inputMsg',inputMsg,(err)=>{
        if(err){
            return console.log('Error Occured')
        }

        console.log('Message Delivered')
        $inputElement.value=''
        $submitButton.removeAttribute('disabled')
    })
})
$shareLocationButton.addEventListener('click',()=>{

    $shareLocationButton.setAttribute('disabled','disabled')
    console.log('clicked')
    if(!navigator.geolocation){
        return alert('Not supported')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        const curPosition={
            lat:position.coords.latitude,
            long:position.coords.longitude
        }
        socket.emit('shareLocation',curPosition,(msg)=>{
            console.log(msg)
            $shareLocationButton.removeAttribute('disabled')
        })
    })

    
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})

socket.on('roomData',({room,users})=>{
    console.log(room)
    console.log(users)

    const html=Mustache.render(sidebarTemplate,{
        room:room,
        users:users
    })
    document.querySelector('#sidebar').innerHTML=html
})