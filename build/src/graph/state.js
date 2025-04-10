"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalState = void 0;
const langgraph_1 = require("@langchain/langgraph");
const GlobalState = langgraph_1.Annotation.Root(Object.assign(Object.assign({}, langgraph_1.MessagesAnnotation.spec), { sql_query: (0, langgraph_1.Annotation)(), wrong_query: (0, langgraph_1.Annotation)(), sql_result: (0, langgraph_1.Annotation)(), nextStep: (0, langgraph_1.Annotation)(), dataAnalysis: (0, langgraph_1.Annotation)() }));
exports.GlobalState = GlobalState;
