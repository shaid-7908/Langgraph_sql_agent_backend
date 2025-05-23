import express from 'express'
import envConfig from './config/env.config'
//import {db} from './config/dbConnect'
import userRouter from './routes/userRoutes'
//import ApiError from './utils/apiError'
import errorHandler from './utils/errorHandler'
//import { Request,Response,NextFunction } from 'express'
import authRouter from './routes/authRoute'
import cors from "cors";
import mongoose from "mongoose";
//import chatMessage from './models/messageModel'

import { setupSwagger } from "./swagger";
//import { callableGraph } from './graph/graph'
import aiRouter from './routes/aiRoutes'

const app = express()
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/myDatabase')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❗ MongoDB connection error:', err));


app.use(
  cors({
    origin: "*", // Allow all origins (for development only)
    methods: ["GET", "POST"], // Allow specific methods
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use('/api/v1/user',userRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/stream-data',aiRouter)
// app.post('/stream-data', async (req,res)=>{
//     const {messages,request_id,thread_id} = req.body;
//     console.log(messages, request_id, thread_id);
//     // Set headers for SSE (Server-Sent Events)
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     try {
//       let config = { configurable: { thread_id: thread_id, request_id: request_id } };
//       //Stream data using callableGraph.stream
//       for await (const chunk of await callableGraph.stream({messages}, {...config,
//         streamMode: "updates",
//       })) {
//         for (const [node, values] of Object.entries(chunk)) {
//           console.log(`Sending update from node: ${node}`);
//           if(node == 'data_analist' || node == 'starter_agent'){
//             console.log(JSON.stringify(values))
            
//           }
//           res.write(`data: ${JSON.stringify({node, values })}\n\n`);
//         }
//       }

//       // Notify completion
//       res.write(`data: ${JSON.stringify({ status: "completed" })}\n\n`);
//       res.end();
//     } catch (error:any) {
//       console.error("Error streaming data:", error);
//       res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
//       res.end();
//     }
// })
setupSwagger(app)
app.use(errorHandler)
const PORT = envConfig.PORT





app.listen(PORT,()=>{
    console.log(PORT)
})

