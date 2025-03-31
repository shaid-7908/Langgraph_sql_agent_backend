import { GlobalState } from "../state";
import {z} from 'zod'
import { getModel } from "../utils/getModel";
import { sqlExecutorTool } from "../tools/sqlExecutorTool";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

const databaseAgent = async (state:typeof GlobalState.State,config:LangGraphRunnableConfig)=>{
    const model = getModel()
    const tools = [sqlExecutorTool]
    const tool_model = model.bindTools(tools)
    const { messages } = state;
    const systemPrompt =
      "Based on the Database_name and Table_info below, write a SQL query that would answer the user's question. " +
      "Take the conversation history into account:\n\n" +
      "Database_name: workmate_banking\n" +
      "Table: customer_trans\n\n" +
      "Fields:\n" +
      "id (int, NO, PRI, auto_increment)\n" +
      "TransactionID (varchar(255), YES, None)\n" +
      "CustomerID (varchar(255), YES, None)\n" +
      "CustomerDOB (datetime, YES, None)\n" +
      "CustGender (varchar(255), YES, None)\n" +
      "CustLocation (varchar(255), YES, None)\n" +
      "CustAccountBalance (float, YES, None)\n" +
      "TransactionDate (datetime, YES, None)\n" +
      "TransactionTime (int, YES, None)\n" +
      "TransactionAmountInr (float, YES, None).\n" +
      "Only write the SQL query, no extra text or backticks.You have some tools given to you ,call them with proper input.";
      const response = await tool_model.invoke([
        { role: "system", content: systemPrompt },
        ...messages,
      ]);
      console.log(config.configurable?.thread_id,'thread_id')
      console.log(config.configurable?.request_id,'request_id')
      console.log(response)
      return {
        messages: response,
        sql_query: response?.tool_calls?.[0]?.args?.input,
      };
}

export {databaseAgent}