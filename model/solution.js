const mongoose = require('mongoose')
const solution = mongoose.Schema({
    createdAt :{
        type:Date , 
        default:new Date()
    } , 
    answerUrl :{
        type:String,
        required:true
    },
    assignment:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    checkedBy:{
        type:mongoose.Types.ObjectId,
        default:null
    },
    grade:{
        type:Number,
        default:null
    },
    user:{
        type:mongoose.Types.ObjectId,
        required:true
    }

})
module.exports = mongoose.model('solution' , solution)