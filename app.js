const express = require('express')
const dotEnv =require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express ()
dotEnv.config()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
/**
 * Routes
 */
const authRoute  =require('./routes/user.auth')
const assignmentRoutes = require('./routes/assignment.routes')
const fileRoutes = require('./routes/file.upload')
const solutionRoutes = require('./routes/solution.routes')

const PORT =process.env.PORT
const dbUrl = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@backendmongo.wksoy.mongodb.net/${process.env.MONG_DB_DATABASE}?retryWrites=true&w=majority`
//Routes listener
app.get('/' , (req,res)=>{
    return res.json({error:true ,msg:"Server is up"})
});
app.use('/user/auth' , authRoute)
app.use('/assignment' , assignmentRoutes)
app.use('/file' ,fileRoutes )
app.use('/solution'  ,solutionRoutes)

/**
 * Create server using express server
 * lsiten on PORT defined on .env file
 */
app.listen(PORT , ()=>{
    console.log(`server is up at http://localhost:${PORT}`);
    /**
     * Mongo Db connection
     */
    mongoose.connect(dbUrl ,
        {useUnifiedTopology: true  , useNewUrlParser: true  },)
        .then(()=>{
            console.log("Mongo Server is connected");
        }).catch(er=>{
            console.log(er);
        });
});

