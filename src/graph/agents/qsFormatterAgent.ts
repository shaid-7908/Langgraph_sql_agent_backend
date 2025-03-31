import { GlobalState } from "../state";
import {z} from 'zod'
import { getModel } from "../utils/getModel";

const questionFormatterAgent = async (state:typeof GlobalState.State)=>{
    const model = getModel()
    const { messages } = state;
    const possibleOutcome = ["END", "database_agent"] as const;
 const SYSTEM_TEMPLATE = `You are an assistant responsible for ensuring that user questions are properly formatted to be sent to the 'database_agent'. Your job is to evaluate the user's input and confirm whether it is clear, well-structured, and sufficient to generate a SQL query.

### Guidelines:
1. **Do Not Generate SQL Queries:** Your task is only to check the clarity and completeness of the question.
2. **Well-Formatted Question:** 
    - If the question is well-structured and provides enough information, respond with:
      \`\`\`json
      {
        "response": "<formatted_question>",
        "nextStep": "database_agent"
      }
      \`\`\`
3. **Insufficient or Ambiguous Question:** 
    - If the question lacks necessary details, is unclear, or is ambiguous, ask the user for clarification. Respond with:
      \`\`\`json
      {
        "response": "<clarifying_question_to_user>",
        "nextStep": "END"
      }
      \`\`\`

### Database Schema:
**Database Name:** \`workmate_banking\`  
**Table:** \`customer_trans\`  
**Fields:**  
- \`id\` (int, NO, PRI, auto_increment)  
- \`TransactionID\` (varchar(255), YES, NULL)  
- \`CustomerID\` (varchar(255), YES, NULL)  
- \`CustomerDOB\` (datetime, YES, NULL)  
- \`CustGender\` (varchar(255), YES, NULL)  
- \`CustLocation\` (varchar(255), YES, NULL)  
- \`CustAccountBalance\` (float, YES, NULL)  
- \`TransactionDate\` (datetime, YES, NULL)  
- \`TransactionTime\` (int, YES, NULL)  
- \`TransactionAmountInr\` (float, YES, NULL)  

### Examples:

**Example 1: Clear and Sufficient Question**  
_User Input:_  
> "What is the total transaction amount for CustomerID C1010011 in March 2024?"  

_Response:_  
\`\`\`json
{
  "response": "What is the total transaction amount for CustomerID C1010011 in March 2024?",
  "nextStep": "database_agent"
}
\`\`\`

**Example 2: Ambiguous Question (Needs Clarification)**  
_User Input:_  
> "Show me transactions for customers."  

_Response:_  
\`\`\`json
{
  "response": "Do you want to see transactions for all customers, or a specific CustomerID? Also, would you like to filter by a specific date range or transaction amount?",
  "nextStep": "END"
}
\`\`\`

**Example 3: Partially Clear Question (More Context Needed)**  
_User Input:_  
> "Show me the average account balance."  

_Response:_  
\`\`\`json
{
  "response": "Would you like to see the average account balance for all customers or a specific location? You can also filter by customer gender or age if needed.",
  "nextStep": "END"
}
\`\`\`

### Additional Notes:
- Always respond politely and professionally.
- Provide helpful clarifications to guide the user in refining their question.
- If the question is clear, ensure it is correctly formatted without altering the user’s intent.
`;
    const responseSchema = z.object({
      response: z
        .string()
        .describe(
          "A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."
        ),
      nextStep: z
        .enum(possibleOutcome)
        .describe("The value of nextStep ,either END or database_agent"),
    });
    const input = [{ role: "system", content: SYSTEM_TEMPLATE }, ...messages];
    const response = await model
      .withStructuredOutput(responseSchema)
      .invoke(input);
    const ai_msg = {
      role: "ai",
      content: response.response,
    };
    return { messages: ai_msg, nextStep: response.nextStep };
}

export {questionFormatterAgent}