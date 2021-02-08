const router =require('express').Router()
const session =require('../utils/session')
const assignment = require('../model/assignment')
const solution = require('../model/solution');
const { emit } = require('npm');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
router.post('/new' ,session , async(req,res)=>{
    const body=req.body
    const name=body.name
    const subject =body.subject
    const question = body.question
    const deadline =body.deadline
    const user = req.user
    const _id = user.userId
    const type = user.type
    if(type!=="INSTRUCTOR"){
        return res.json({error:true,msg:"Not authorized"})
    }

    const option = {
        name:name , 
        subject:subject,
        question:question,
        deadline:deadline,
        createdBy:_id 
    }
    const newAssignment = new assignment(option)
    newAssignment.save().then(data=>{
        return res.json({error:false , msg:"Assignment created" , data:data})
    }).catch(er=>{
        return res.json({error:true ,msg:er.message})
    })



});

router.get('/' ,session ,  async(req , res)=>{
    const _user = req.user
    const _userid = _user.userId
    assignment.find({createdBy:_userid})
    .sort({createdAt:-1})
    .then(data=>{
        return res.json({error:false ,records:data ,msg:"Found list of assignment"})

    }).catch(er=>{
        return res.json({error:true  ,msg:er.message})
    })

});

router.get('/upcoming' , session , async(req,res)=>{
    const _user = req.user
    const _userid = _user.userId
    assignment.aggregate([
        {$lookup:{
            from:"solutions",
            localField: '_id',
            foreignField: 'assignment',
            as: 'solution', 
        },
          
    }, { $match: { deadline: { $gte: new Date() } } },
    ]).then(data=>{

        // console.log(data);
        return res.json({error:false  ,msg:"Found" , records:data})
    }).catch(er=>{
        console.log(er);
    })

   
});
router.get('/submitted'  ,session , async(req,res)=>{
    const _user = req.user
    const userid = _user.userId
    // console.log(userid);
    solution.aggregate(
        [
        {$lookup:{
        from:"assignments",
        localField: 'assignment',
        foreignField: '_id',
        as: 'question', 
    }},
     {$match:{'user':ObjectId(userid)}}
]).then(data=>{

        // console.log(data);
        return res.json({error:false , record:data})
    }).catch(er=>{
        console.log(er);
        return res.json({error:true , msg:"HEllo"})
    })
})
router.get('/:id' , session  ,async(req,res)=>{
    const id = req.params.id 
    assignment.findById(id).then(data=>{
        return res.json({error:false, msg:"Data fetch" , record:data})
    }).catch(er=>{
        return res.json({error:true , msg:"Error server side"})
    })
})

router.get('/student/:id'   ,async(req , res)=>{
    // return res
    const id = req.params.id 
    solution.aggregate(
        [{$lookup:{
        from:"assignments",
        localField: 'assignment',
        foreignField: '_id',
        as: 'question', 
    }},
     {$match:{'user':ObjectId(id)}}
   ]).then(data=>{
       return res.json({error:false ,msg:"Found" , data:data})

   }).catch(er=>{
       console.log(er);
       return res.json({error:true,msg:"Error"})
   })
    
})

// const checkIsSubmitted =async ({user , assignment})=>{
//    await solution.findOne({user:user , assignment:assignment})
//     .then(data=>{
//         if(data){
//             return true 
//         }
//         return false
//     }).catch(err=>{
//         return false
//     })
// }

const getAssignment = async (id)=>{

  return await  assignment.findById(id).then(data=>{
      return data
    }).catch(err=>{
        return null
    })
}
module.exports  =router