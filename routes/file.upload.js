const router = require('express').Router()
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const session =require('../utils/session')

const ID = process.env.AWS_ACCESS_ID;
const SECRET = process.env.AWS_ACCESS_KEY;
// The name of the bucket that you have created
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

aws.config.update({
  region: 'ap-south-1', // Put your aws region here
  accessKeyId: ID,
  secretAccessKey: SECRET
});
const s3 = new aws.S3();
var imageFilter =  function (req, file, callback) {
    if(!file.originalname.match(/\.(pdf|PDF)$/)){
        req.fileValidationError = "only image allowed"
       return callback(new Error("File document Error") , false)
    }
    callback(null , true)
}
var upload = multer({storage:multerS3({
    s3:s3 , 
    bucket:BUCKET_NAME ,acl:'public-read' ,
    contentType: multerS3.AUTO_CONTENT_TYPE , 
    filename: function (req, file, cb) {
      // console.log(file.originalname);
      cb(null, { fieldName: file.fieldname });
  }}) , fileFilter:imageFilter})


router.post('/upload' , session ,upload.single('file'), async(req,res)=>{
    const uploadedFile = req.file
    if(uploadedFile===null ||uploadedFile===undefined){
     return res.json({
            error:true , 
            msg:"File upload failed, file not found" , 
        }).status(400)   
    } 
    return res.json({error:false  , msg:"file document uploaded" , file:req.file.location});
});

module.exports = router