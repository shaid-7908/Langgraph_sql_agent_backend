import express from 'express'
import envConfig from './config/env.config'
import {db} from './config/dbConnect'
import userRouter from './routes/userRoutes'
import ApiError from './utils/apiError'
import errorHandler from './utils/errorHandler'
import { Request,Response,NextFunction } from 'express'
import authRouter from './routes/authRoute'

const app = express()
app.use(express.json());
app.use('/api/v1/user',userRouter)
app.use('/api/v1/auth',authRouter)
app.use(errorHandler)
const PORT = envConfig.PORT





app.listen(PORT,()=>{
    console.log(PORT)
})

