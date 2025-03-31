import { agentDbConnection } from "../utils/agentDbConnection";
import { ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { Command } from "@langchain/langgraph";
import {z} from 'zod'

const sqlExecutorTool = tool(async (input,config)=>{
    const connection = await agentDbConnection()
    if(!connection) return
     try {
       const [rows] = await connection.execute(input.input);
       const result = [rows];
       return new Command({
         update: {
           wrong_query: "false",
           sql_result: result,
           messages: [
             new ToolMessage({
               content: "Query Executed success fully",
               tool_call_id: config.toolCall.id,
             }),
           ],
         },
       });
     } catch (error) {
       return new Command({
         update: {
           wrong_query: "true",
           messages: [
             new ToolMessage({
               content: String(error),
               tool_call_id: config.toolCall.id,
             }),
           ],
         },
       });
     } finally {
       await connection.end(); // Close the connection
     }

},{
name:'sql_executor_tool',
description:'This tool can execute an sql query',
schema:z.object({input:z.string().describe('The sql query to execute')})
})

export {sqlExecutorTool}
