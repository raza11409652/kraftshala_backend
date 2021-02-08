/**
 * @todo Solution can only be submitted by student
 * solution can't be submitted after deadline
 */
const router = require('express').Router()
const session = require('../utils/session')
const solution = require('../model/solution')
const assignment = require('../model/assignment')
router.post('/submit' , session ,async(req,res)=>{
    const _user = req.user
    const _id = _user.userId
    const type = _user.type
    if(type!=="STUDENT"){
        return res.json({error:true,msg:"Not authorized"})
    }

    const body = req.body
    const assignmentId =body.assignment
    const answer = body.answer
    const option ={
        answerUrl:answer,
        assignment:assignmentId,
        user:_id
    }
   await solution.findOne({user:_id , assignment:assignmentId}).then(data=>{
        if(data){
            return res.json({error:true , msg:"Already submitted"})
        }
        const newSolution  =new solution(option)
        newSolution.save().then(data=>{
            return res.json({
                error:false , 
                msg:"Solution submitted",
                data:data
            })
    
        }).catch(er=>{
            return res.json({error:true , msg:er.message})
        })

    }).catch(er=>{
        return res.json({error:true  ,msg:"Error while fethcing data"})
    })

   

})

router.get('/all' , session , async(req,res)=>{
    solution.find().then(data=>{

        return res.json({error:false , records:data , msg:"list found"})
    }).catch(er=>{
        return res.json({error:true ,msg:"Error while fetchig.."})
    })
})

router.get('/:assignment' , session  ,async(req,res)=>{
    const id =req.params.assignment
    assignment.findById(id).then(response=>{

        solution.find({assignment:id}).then(data=>{

            return res.json({error:false   ,msg:"foudn" , assignment:response, records:data})
        }).catch(err=>{
            return res.json({error:true , msg:"Error"})
    
        })
        
    }).catch(err=>{

    })
   

})
router.get('/single/:id' ,session , async(req,res)=>{
    const _user = req.user
    const _id = _user.userId
    const type = _user.type
    if(type!=="INSTRUCTOR"){
        return res.json({error:true,msg:"Not authorized"})
    }
    const id = req.params.id
    solution.findById(id).then(data=>{

        return res.json({error:false , msg:"Hello" , data:data})
    }).catch(err=>{

    });
});

router.post('/grade' , session , async(req,res)=>{
    const _user = req.user
    const _id = _user.userId
    const type = _user.type
    if(type!=="INSTRUCTOR"){
        return res.json({error:true,msg:"Not authorized"})
    }
    const body = req.body
    const grade = parseInt(body.grade)
    const _solution  =body.solution
    solution.findById(_solution).then(data=>{
        if(data.grade!==null){
            return res.json({error:true , msg:"Alredy checked"})
        }
    solution.findByIdAndUpdate(_solution , {grade:grade , checkedBy:_id})
    .then(data=>{
        return res.json({error:false , msg:"Marks updated" , data:data})
    }).catch(err=>{
        return res.json({error:true , msg:"Error"})
    })
    }).catch(err=>{

    })
    
})

module.exports = router