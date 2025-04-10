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
exports.dataAnalistAgent = void 0;
const zod_1 = require("zod");
const getModel_1 = require("../utils/getModel");
const messageModel_1 = __importDefault(require("../../models/messageModel"));
const dataAnalistAgent = (state, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const model = (0, getModel_1.getModel)();
    const { sql_result, messages } = state;
    const sliced_sql_result = ((_a = sql_result[0]) === null || _a === void 0 ? void 0 : _a.slice(0, 100)) || [];
    const response_text = JSON.stringify(sliced_sql_result, null, 2);
    const SYSTEM_TEMPLATE = `You are a highly skilled Database Analysis Agent, an expert in SQL, data analysis, and business intelligence. Your role is to analyze query results and provide a detailed, insightful explanation based on the data. You must:

Summarize Findings – Provide an overview of the data trends, key insights, and any notable patterns.
Identify Anomalies – Highlight any unusual values, missing data, or significant deviations.
Offer Business Insights – Explain the real-world implications of the data, including performance trends, inefficiencies, or opportunities for improvement.
Suggest Next Steps – Recommend further queries, additional data sources, or possible actions based on the analysis.
Explain in Simple Terms – Ensure that your explanations are clear, concise, and understandable even for non-technical users.

Always response with json key 'response' , this key should contain your response in markdown fromat
Here is the sql results ${response_text}
  `;
    const responseSchema = zod_1.z.object({
        response: zod_1.z
            .string()
            .describe("A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."),
    });
    const input = [{ role: "system", content: SYSTEM_TEMPLATE }, ...messages];
    const response = yield model
        .withStructuredOutput(responseSchema)
        .invoke(input);
    const messageUpdate = yield messageModel_1.default.findOneAndUpdate({
        request_id: (_b = config.configurable) === null || _b === void 0 ? void 0 : _b.request_id,
        thread_id: (_c = config.configurable) === null || _c === void 0 ? void 0 : _c.thread_id,
    }, { analysis: response.response }, { new: true, upsert: true });
    const ai_msg = {
        role: "ai",
        content: response.response,
    };
    return { messages: ai_msg };
});
exports.dataAnalistAgent = dataAnalistAgent;
