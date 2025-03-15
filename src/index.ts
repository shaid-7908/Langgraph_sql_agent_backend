import express from 'express'
import envConfig from './config/env.config'
import {db} from './config/dbConnect'
import { UserTable } from './drizzle/schema/user.schema'

const app = express()

const PORT = envConfig.PORT

app.listen(PORT,()=>{
    console.log(PORT)
})

