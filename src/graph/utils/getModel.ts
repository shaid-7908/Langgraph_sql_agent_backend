import { ChatGroq } from "@langchain/groq";
import envConfig from "../../config/env.config";

const getModel = ()=>{

const model = new ChatGroq({
  apiKey: envConfig.GROQ_API_KEY,
  temperature: 0,
  model: "llama-3.3-70b-versatile",
});
return model
}

export {getModel}