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
exports.databaseAgent = void 0;
const getModel_1 = require("../utils/getModel");
const sqlExecutorTool_1 = require("../tools/sqlExecutorTool");
const messageModel_1 = __importDefault(require("../../models/messageModel"));
const databaseAgent = (state, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const model = (0, getModel_1.getModel)();
    const tools = [sqlExecutorTool_1.sqlExecutorTool];
    const tool_model = model.bindTools(tools);
    const { messages } = state;
    const systemPrompt = "Based on the Database_name and Table_info below, write a SQL query that would answer the user's question. " +
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
    const response = yield tool_model.invoke([
        { role: "system", content: systemPrompt },
        ...messages,
    ]);
    const messageUpdate = yield messageModel_1.default.findOneAndUpdate({
        request_id: (_a = config.configurable) === null || _a === void 0 ? void 0 : _a.request_id,
        thread_id: (_b = config.configurable) === null || _b === void 0 ? void 0 : _b.thread_id,
    }, {
        sender: "Ai",
        sql_query: (_e = (_d = (_c = response === null || response === void 0 ? void 0 : response.tool_calls) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.args) === null || _e === void 0 ? void 0 : _e.input,
        request_id: (_f = config.configurable) === null || _f === void 0 ? void 0 : _f.request_id,
        thread_id: (_g = config.configurable) === null || _g === void 0 ? void 0 : _g.thread_id
    }, {
        new: true,
        upsert: true
    });
    return {
        messages: response,
        sql_query: (_k = (_j = (_h = response === null || response === void 0 ? void 0 : response.tool_calls) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.args) === null || _k === void 0 ? void 0 : _k.input,
    };
});
exports.databaseAgent = databaseAgent;
