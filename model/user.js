const mongoose = require('mongoose')

const User = mongoose.Schema({
    name:{
        type:String , 
        required:true 
    },
    email:{
        type:String,
        required:true ,
        unique:true
    },
    password:{
        type:String , 
        required:true,
    },
    createdOn:{
        type:Date,
        default:new Date()
    },
    type:{
        type:String,
        default:"STUDENT"
    },
    subject:{
        type:[],
        default:null
    },
    isVerified:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('user',User)