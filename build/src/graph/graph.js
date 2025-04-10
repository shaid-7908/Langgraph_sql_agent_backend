"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callableGraph = void 0;
const entryAgent_1 = require("./agents/entryAgent");
const qsFormatterAgent_1 = require("./agents/qsFormatterAgent");
const sqlExecutorTool_1 = require("./tools/sqlExecutorTool");
const databaseAgent_1 = require("./agents/databaseAgent");
const dataAnalistAgent_1 = require("./agents/dataAnalistAgent");
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const state_1 = require("./state");
process.env.LANGCHAIN_API_KEY =
    "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";
process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_PROJECT = "test_7908";
// process.env.TAVILY_API_KEY = "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";
// process.env.GROQ_API_KEY =
//   "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";
//Routers for the graph
const baseRouter = (state) => {
    const { nextStep } = state;
    if (nextStep == "END") {
        return langgraph_1.END;
    }
    else if (nextStep == "question_formatter") {
        return "question_formatter";
    }
    else {
        return langgraph_1.END;
    }
};
const questionFormatterRouter = (state) => {
    const { nextStep } = state;
    if (nextStep == "END") {
        return langgraph_1.END;
    }
    else if (nextStep == "database_agent") {
        return "database_agent";
    }
    else {
        return langgraph_1.END;
    }
};
const database_n_analist_router = (state) => {
    const { wrong_query } = state;
    if (wrong_query == "true") {
        return "database_agent";
    }
    else if (wrong_query == "false") {
        return "data_analist";
    }
    else {
        return langgraph_1.END;
    }
};
const tools = [sqlExecutorTool_1.sqlExecutorTool];
const toolNode = new prebuilt_1.ToolNode(tools);
const graph = new langgraph_1.StateGraph(state_1.GlobalState)
    .addNode("starter_agent", entryAgent_1.entryAgent)
    .addNode("question_formatter", qsFormatterAgent_1.questionFormatterAgent)
    .addNode("database_agent", databaseAgent_1.databaseAgent)
    .addNode("tool_node", toolNode)
    .addNode("data_analist", dataAnalistAgent_1.dataAnalistAgent)
    .addEdge("__start__", "starter_agent")
    .addConditionalEdges("starter_agent", baseRouter, ["question_formatter", langgraph_1.END])
    .addConditionalEdges("question_formatter", questionFormatterRouter, [
    "database_agent",
    langgraph_1.END,
])
    .addEdge("database_agent", "tool_node")
    .addConditionalEdges("tool_node", database_n_analist_router, [
    "database_agent",
    "data_analist",
])
    .addEdge("data_analist", "__end__");
const callableGraph = graph.compile();
exports.callableGraph = callableGraph;
