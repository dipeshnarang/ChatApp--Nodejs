const generateMessage=function(text){
    return {
        text:text,
        createdAt:new Date()
    }
}

const locationMessage=function(curPosition){
    return{
        url:`https://www.google.com/maps/@${curPosition.lat},${curPosition.long}`,
        createdAt:new Date()
    }
}

module.exports={
    generateMessage,
    locationMessage
}