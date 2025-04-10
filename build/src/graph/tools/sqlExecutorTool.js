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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlExecutorTool = void 0;
const agentDbConnection_1 = require("../utils/agentDbConnection");
const messages_1 = require("@langchain/core/messages");
const tools_1 = require("@langchain/core/tools");
const langgraph_1 = require("@langchain/langgraph");
const zod_1 = require("zod");
const sqlExecutorTool = (0, tools_1.tool)((input, config) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield (0, agentDbConnection_1.agentDbConnection)();
    if (!connection)
        return;
    try {
        const [rows] = yield connection.execute(input.input);
        const result = [rows];
        return new langgraph_1.Command({
            update: {
                wrong_query: "false",
                sql_result: result,
                messages: [
                    new messages_1.ToolMessage({
                        content: "Query Executed success fully",
                        tool_call_id: config.toolCall.id,
                    }),
                ],
            },
        });
    }
    catch (error) {
        return new langgraph_1.Command({
            update: {
                wrong_query: "true",
                messages: [
                    new messages_1.ToolMessage({
                        content: String(error),
                        tool_call_id: config.toolCall.id,
                    }),
                ],
            },
        });
    }
    finally {
        yield connection.end(); // Close the connection
    }
}), {
    name: 'sql_executor_tool',
    description: 'This tool can execute an sql query',
    schema: zod_1.z.object({ input: zod_1.z.string().describe('The sql query to execute') })
});
exports.sqlExecutorTool = sqlExecutorTool;
