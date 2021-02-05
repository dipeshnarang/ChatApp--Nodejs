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

//Query String
const {username, room}=Qs.parse(location.search, {ignoreQueryPrefix:true})

socket.on('countUpdated', (count)=>
{
    console.log('count has been updated : ' +count)
})

// const increment=document.querySelector('#btn1')
// increment.addEventListener('click', ()=>
// {

//     console.log('clicked')
//     socket.emit('increment')
// }) 

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render($messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(location)=>{
    console.log(location)
    const html=Mustache.render(locationMessageTemplate,{
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

socket.emit('join',{username,room})
