const mongoose = require('mongoose')

const Assignment = mongoose.Schema({
    name:{
        type:String,
        required:true ,
        unique:true 
    },
    subject:{
        type:String,
        required:true , 
    },
    question:{
        type:String,
        required:true , 
    },
    deadline:{
        type:Date ,
        required:true ,
    },
    createdAt:{
        type:Date ,
        required:true ,
        default:new Date()
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        required:true  , 
    }

})
module.exports =mongoose.model('assignment' ,Assignment)