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
exports.entryAgent = void 0;
const zod_1 = require("zod");
const getModel_1 = require("../utils/getModel");
const messageModel_1 = __importDefault(require("../../models/messageModel"));
const entryAgent = (state, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const model = (0, getModel_1.getModel)();
    const { messages } = state;
    const possibleOutcome = ["END", "question_formatter"];
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
    const responseSchema = zod_1.z.object({
        response: zod_1.z
            .string()
            .describe("A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."),
        nextStep: zod_1.z
            .enum(possibleOutcome)
            .describe("The value of nextStep ,either END or question_formatter"),
    });
    const input = [{ role: "system", content: SYSTEM_TEMPLATE }, ...messages];
    const response = yield model
        .withStructuredOutput(responseSchema)
        .invoke(input);
    if (response.nextStep == "END") {
        const messageUpdate = yield messageModel_1.default.findOneAndUpdate({
            request_id: (_a = config.configurable) === null || _a === void 0 ? void 0 : _a.request_id,
            thread_id: (_b = config.configurable) === null || _b === void 0 ? void 0 : _b.thread_id,
        }, {
            sender: "Ai",
            analysis: response.response,
            request_id: (_c = config.configurable) === null || _c === void 0 ? void 0 : _c.request_id,
            thread_id: (_d = config.configurable) === null || _d === void 0 ? void 0 : _d.thread_id,
            sql_query: ''
        }, { new: true, upsert: true });
    }
    //format the message as ai message
    const ai_msg = {
        role: "ai",
        content: response.response,
    };
    return { messages: ai_msg, nextStep: response.nextStep };
});
exports.entryAgent = entryAgent;
