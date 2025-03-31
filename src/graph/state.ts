import { Annotation,MessagesAnnotation } from "@langchain/langgraph";

const GlobalState = Annotation.Root({
  ...MessagesAnnotation.spec,
  sql_query: Annotation<string>(),
  wrong_query: Annotation<string>(),
  sql_result: Annotation<any>(),
  nextStep: Annotation<string>(),
  dataAnalysis: Annotation<string>(),
});

export {GlobalState}