"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionFormatterAgent = void 0;
const zod_1 = require("zod");
const getModel_1 = require("../utils/getModel");
const messageModel_1 = __importDefault(require("../../models/messageModel"));
const questionFormatterAgent = (state, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const model = (0, getModel_1.getModel)();
    const { messages } = state;
    const possibleOutcome = ["END", "database_agent"];
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
    const responseSchema = zod_1.z.object({
        response: zod_1.z
            .string()
            .describe("A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."),
        nextStep: zod_1.z
            .enum(possibleOutcome)
            .describe("The value of nextStep ,either END or database_agent"),
    });
    const input = [{ role: "system", content: SYSTEM_TEMPLATE }, ...messages];
    const response = yield model
        .withStructuredOutput(responseSchema)
        .invoke(input);
    if (response.nextStep == 'END') {
        const messageUpdate = yield messageModel_1.default.findOneAndUpdate({
            request_id: (_a = config.configurable) === null || _a === void 0 ? void 0 : _a.request_id,
            thread_id: (_b = config.configurable) === null || _b === void 0 ? void 0 : _b.thread_id,
        }, {
            sender: "Ai",
            analysis: response.response,
            request_id: (_c = config.configurable) === null || _c === void 0 ? void 0 : _c.request_id,
            thread_id: (_d = config.configurable) === null || _d === void 0 ? void 0 : _d.thread_id,
            sql_query: "",
        }, { new: true, upsert: true });
    }
    const ai_msg = {
        role: "ai",
        content: response.response,
    };
    return { messages: ai_msg, nextStep: response.nextStep };
});
exports.questionFormatterAgent = questionFormatterAgent;
