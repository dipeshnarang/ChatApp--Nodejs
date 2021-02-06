const generateMessage=function(text,user){
    return {
        username:user.username,
        text:text,
        createdAt:new Date()
    }
}

const locationMessage=function(curPosition,user){
    console.log(curPosition)
    return{
        username:user.username,
        url:`https://www.google.com/maps/@${curPosition.lat},${curPosition.long}`,
        createdAt:new Date()
    }
}

module.exports={
    generateMessage,
    locationMessage
}