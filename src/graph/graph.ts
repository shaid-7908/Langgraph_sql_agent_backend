import { entryAgent } from "./agents/entryAgent";
import { questionFormatterAgent } from "./agents/qsFormatterAgent";
import { sqlExecutorTool } from "./tools/sqlExecutorTool";
import { databaseAgent } from "./agents/databaseAgent";
import { dataAnalistAgent } from "./agents/dataAnalistAgent";
import { StateGraph,END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { GlobalState } from "./state";
process.env.LANGCHAIN_API_KEY =
  "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";
process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_PROJECT = "test_7908";
// process.env.TAVILY_API_KEY = "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";
// process.env.GROQ_API_KEY =
//   "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";


//Routers for the graph
const baseRouter = (state: typeof GlobalState.State) => {
  const { nextStep } = state;
  if (nextStep == "END") {
    return END;
  } else if (nextStep == "question_formatter") {
    return "question_formatter";
  } else {
    return END;
  }
};

const questionFormatterRouter = (state:typeof GlobalState.State) =>{
      const { nextStep } = state;
      if (nextStep == "END") {
        return END;
      } else if (nextStep == "database_agent") {
        return "database_agent";
      } else {
        return END;
      }
}

const database_n_analist_router = (state:typeof GlobalState.State)=>{
    const { wrong_query } = state;
    if (wrong_query == "true") {
      return "database_agent";
    } else if (wrong_query == "false") {
      return "data_analist";
    } else {
      return END;
    }
}
const tools = [sqlExecutorTool]

const toolNode = new ToolNode<typeof GlobalState.State>(tools)

const graph = new StateGraph(GlobalState)
  .addNode("starter_agent", entryAgent)
  .addNode("question_formatter", questionFormatterAgent)
  .addNode("database_agent", databaseAgent)
  .addNode("tool_node", toolNode)
  .addNode("data_analist", dataAnalistAgent)
  .addEdge("__start__", "starter_agent")
  .addConditionalEdges("starter_agent", baseRouter, ["question_formatter", END])
  .addConditionalEdges("question_formatter", questionFormatterRouter, [
    "database_agent",
    END,
  ])
  .addEdge("database_agent", "tool_node")
  .addConditionalEdges("tool_node", database_n_analist_router, [
    "database_agent",
    "data_analist",
  ])
  .addEdge("data_analist", "__end__");

const callableGraph = graph.compile()

export {callableGraph}