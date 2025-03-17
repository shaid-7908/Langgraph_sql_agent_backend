import express from 'express'
import envConfig from './config/env.config'
import {db} from './config/dbConnect'
import userRouter from './routes/userRoutes'
import ApiError from './utils/apiError'
import { Request,Response,NextFunction } from 'express'

const app = express()
app.use(express.json());
app.use('/api/v1/user',userRouter)
const PORT = envConfig.PORT





app.listen(PORT,()=>{
    console.log(PORT)
})

