const router  =require('express').Router()
const validator = require('validator').default
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../model/user')
const saltRound = process.env.SALT_ROUND
const session = require('../utils/session')
// console.log(saltRound);
/**
 * Register route
 */
router.post('/register' , async(req,res)=>{
    const body = req.body
    console.log(body);
    const email = body.email 
    const password = body.password
    const type = body.type
    const name = body.name 
    const subject = body.subject

    if(email===null||email===undefined){
        return res.json({error:true , msg:"Email is missing"});
    }
    if(password===null||password===undefined){
        return res.json({
            error:true , msg:"Password is missing"
        })
    }

    if(name===null||name===undefined){
        return res.json({
            error:true , 
            msg:"Name is required"
        })
    }

    if(type===null||type===undefined){
        return res.json({
            error:true , 
            msg:"Required param missing"
        })
    }


    if(!validator.isEmail(email)){
        return res.json({error:true , msg:"Invalid email"})
    }

    const salt = bcrypt.genSaltSync(parseInt(saltRound))
    const hashPassword = bcrypt.hashSync(password , salt)
    const option = {
        name:name , 
        email:email , 
        password:hashPassword,
        type:type,
        subject:subject
    }
    const newUser = new user(option)
    newUser.save().then(data=>{
        // console.log(data);
        /**
         * Process email should be sent for account varfication
         * Currently email verifcation is not applied
         * isVerified :true Auto
         */
        return res.json({
            error:false , 
            msg:"Regisatrtion success , Now you can login into your account"
        })
    }).catch(er=>{
        return res.json({error:true , msg:er.message})
    })
    
});
/**Login route 
 * @param email
 * @param password
 */
router.post('/login' , async(req,res)=>{
    const body  = req.body
    const email = body.email
    const password =body.password
    if(email===null||email===undefined){
        return res.json({error:true , msg:"Email is missing"});
    }
    if(password===null||password===undefined){
        return res.json({
            error:true , msg:"Password is missing"
        })
    }
    user.findOne({email:email}).then(data=>{
        if(!data){
            //User not found
            return res.json({error:true , msg:"Auth failed"})
        }
        const hashPassword = data.password
        const flag = bcrypt.compareSync(password , hashPassword)
        if(!flag){
            return res.json({error:true ,msg:"Auth failed"})
        }
        const userId = data._id 
        const email  = data.email
        const payload = {
            userId:userId , 
            email:email,
            type:data.type
        }
        const loginToken = jwt.sign(payload , process.env.SECRET_KEY)
        return res.json({error:false , msg:"Auth success" , 
        user:{
            name:data.name,
            email:data.email ,
            subject:data.subject,
            type:data.type ,
            status:data.isVerified
        } , token:loginToken})
        
    }).catch(er=>{
        return res.json({
            error:true , msg:er.message
        })
    })
    

});
router.get('/accesstoken' , session  ,async(req,res)=>{
    const _user = req.user
    const _id = _user.userId
    user.findById(_id).then(data=>{
        return res.json({error:false , msg:"Auth success" , 
        user:{
            id:data._id,
            name:data.name,
            email:data.email ,
            subject:data.subject,
            type:data.type ,
            status:data.isVerified
        }})
    }).catch(er=>{
        return res.json({
            error:true , msg:er.message
        })
    })

})
/**
 * Search
 * @todo only work for instructor
 */
router.get('/search/:query' , async(req,res)=>{
    const query = req.params.query 
    if(query===null ||query ===undefined){
        return res.json({error:true , msg:"Nothing found"})
    }
    user.find({
        $or:[{name:{$regex:query} , email:{$regex:query}}]
    }).then(data=>{
        return res.json({error:false , data:data , msg:"Found result"})
    }).catch(er=>{
        return res.json({error:true , msg:"Nothing found"})
    })


})
module.exports = router