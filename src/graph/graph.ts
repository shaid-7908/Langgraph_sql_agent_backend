import { entryAgent } from "./agents/entryAgent";
import { questionFormatterAgent } from "./agents/qsFormatterAgent";
import { sqlExecutorTool } from "./tools/sqlExecutorTool";
import { databaseAgent } from "./agents/databaseAgent";
import { dataAnalistAgent } from "./agents/dataAnalistAgent";
import { StateGraph,END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { GlobalState } from "./state";


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