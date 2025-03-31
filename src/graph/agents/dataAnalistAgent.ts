import { GlobalState } from "../state";
import {z} from 'zod'
import { getModel } from "../utils/getModel";

const dataAnalistAgent = async (state:typeof GlobalState.State)=>{
      const model = getModel()
      const { sql_result, messages } = state;
      const sliced_sql_result = sql_result[0]?.slice(0, 100) || [];
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
      const responseSchema = z.object({
        response: z
          .string()
          .describe(
            "A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."
          ),
      });
      const input = [{ role: "system", content: SYSTEM_TEMPLATE }, ...messages];
      const response = await model
        .withStructuredOutput(responseSchema)
        .invoke(input);
      const ai_msg = {
        role: "ai",
        content: response.response,
      };
      return { messages: ai_msg, dataAnalysis: response.response };
}

export {dataAnalistAgent}