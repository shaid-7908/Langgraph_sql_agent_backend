"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_config_1 = __importDefault(require("./config/env.config"));
//import {db} from './config/dbConnect'
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
//import ApiError from './utils/apiError'
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
//import { Request,Response,NextFunction } from 'express'
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
//import chatMessage from './models/messageModel'
const swagger_1 = require("./swagger");
//import { callableGraph } from './graph/graph'
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const app = (0, express_1.default)();
// MongoDB Connection
mongoose_1.default.connect('mongodb://localhost:27017/myDatabase')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❗ MongoDB connection error:', err));
app.use((0, cors_1.default)({
    origin: "*", // Allow all origins (for development only)
    methods: ["GET", "POST"], // Allow specific methods
    allowedHeaders: ["Content-Type"],
}));
app.use(express_1.default.json());
app.use('/api/v1/user', userRoutes_1.default);
app.use('/api/v1/auth', authRoute_1.default);
app.use('/api/v1/stream-data', aiRoutes_1.default);
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
(0, swagger_1.setupSwagger)(app);
app.use(errorHandler_1.default);
const PORT = env_config_1.default.PORT;
app.listen(PORT, () => {
    console.log(PORT);
});
