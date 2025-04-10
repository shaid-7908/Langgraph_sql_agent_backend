import { GlobalState } from "../state";
import { z } from "zod";
import { getModel } from "../utils/getModel";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import chatMessage from "../../models/messageModel";

const entryAgent = async (
  state: typeof GlobalState.State,
  config: LangGraphRunnableConfig
) => {
  const model = getModel();
  const { messages } = state;
  const possibleOutcome = ["END", "question_formatter"] as const;
  const SYSTEM_TEMPLATE = `You are a helful assiatnace.Based on user input decide if it's a general conversation or question,
         you should answer it directly with two JSON key "response" key which will have Your actual reply to the users question and "nextStep" key with "END" as value.
         IF the question is about a database or to answer the question a call to databse is required then "response" key would be empty string and "nextStep" key would be 'question_formatter'.
         Here is the schema info of the user database:
         "Database_name: workmate_banking\n"
        "Table: customer_trans\n\n"
        "Fields:\n" 
        "id (int, NO, PRI, auto_increment)\n" 
        "TransactionID (varchar(255), YES, None)\n"
        "CustomerID (varchar(255), YES, None)\n"
        "CustomerDOB (datetime, YES, None)\n" 
        "CustGender (varchar(255), YES, None)\n" 
        "CustLocation (varchar(255), YES, None)\n" 
        "CustAccountBalance (float, YES, None)\n" 
        "TransactionDate (datetime, YES, None)\n" 
        "TransactionTime (int, YES, None)\n" 
        "TransactionAmountInr (float, YES, None).\n"  
        `;

  const responseSchema = z.object({
    response: z
      .string()
      .describe(
        "A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."
      ),
    nextStep: z
      .enum(possibleOutcome)
      .describe("The value of nextStep ,either END or question_formatter"),
  });
  const input = [{ role: "system", content: SYSTEM_TEMPLATE }, ...messages];

  const response = await model
    .withStructuredOutput(responseSchema)
    .invoke(input);

  if (response.nextStep == "END") {
    const messageUpdate = await chatMessage.findOneAndUpdate(
      {
        request_id: config.configurable?.request_id,
        thread_id: config.configurable?.thread_id,
      },
      {
        sender: "Ai",
        analysis: response.response,
        request_id: config.configurable?.request_id,
        thread_id: config.configurable?.thread_id,
        sql_query:''
      },
      {new:true,upsert:true}
    );
  }
  //format the message as ai message
  const ai_msg = {
    role: "ai",
    content: response.response,
  };
  return { messages: ai_msg, nextStep: response.nextStep };
};

export { entryAgent };
