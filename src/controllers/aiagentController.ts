import { callableGraph } from "../graph/graph";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

class AiAgentController {
  //   static streamGraphResponse = asyncHandler(
  //     async (req: Request, res: Response): Promise<any> => {
  //       const { messages, request_id, thread_id } = req.body;

  //       // Validate required parameters
  //       if (!messages || !request_id || !thread_id) {
  //         res
  //           .status(400)
  //           .json({
  //             error:
  //               "Missing required parameters: messages, request_id, and thread_id",
  //           });
  //         return;
  //       }

  //       console.log(
  //         `Starting stream for request_id: ${request_id}, thread_id: ${thread_id}`
  //       );
  //       console.log("Messages:", messages);

  //       // Set headers for SSE (Server-Sent Events)
  //       res.setHeader("Content-Type", "text/event-stream");
  //       res.setHeader("Cache-Control", "no-cache");
  //       res.setHeader("Connection", "keep-alive");
  //       // Optionally add CORS headers if needed for your client
  //       res.setHeader("Access-Control-Allow-Origin", "*");
  //       res.flushHeaders()
  //       // Monitor client disconnects to gracefully stop streaming
  //       req.on("close", () => {
  //         console.log(`Client disconnected for request_id: ${request_id}`);
  //         res.end();
  //       });

  //       const config = { configurable: { thread_id, request_id } };

  //       try {
  //         // Obtain the stream from the callableGraph
  //         const stream = await callableGraph.stream(
  //           { messages },
  //           { ...config, streamMode: "updates" }
  //         );

  //         // Use for-await-of loop to process chunks from async iterator
  //         for await (const chunk of stream) {
  //           for (const [node, values] of Object.entries(chunk)) {
  //             console.log(`Sending update from node: ${node}`);
  //             if (node === "data_analist" || node === "starter_agent") {
  //               console.log("Values:", JSON.stringify(values));
  //             }
  //             res.write(`data: ${JSON.stringify({ node, values })}\n\n`);

  //           }
  //         }

  //         // Notify the client that streaming is completed
  //         res.write(`data: ${JSON.stringify({ status: "completed" })}\n\n`);
  //         res.end();
  //       } catch (error: any) {
  //         console.error("Error during streaming process:", error);
  //         // Notify the client of an error
  //         res.write(
  //           `data: ${JSON.stringify({
  //             status: "error",
  //             error: error.message,
  //           })}\n\n`
  //         );
  //         res.end();
  //       }
  //     }
  //   );
  static streamGraphResponse = async (req:Request, res:Response) => {
    const { messages, request_id, thread_id } = req.body;
    console.log(messages, request_id, thread_id);
    // Set headers for SSE (Server-Sent Events)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      let config = {
        configurable: { thread_id: thread_id, request_id: request_id },
      };
      //Stream data using callableGraph.stream
      for await (const chunk of await callableGraph.stream(
        { messages },
        { ...config, streamMode: "updates" }
      )) {
        for (const [node, values] of Object.entries(chunk)) {
          console.log(`Sending update from node: ${node}`);
          if (node == "data_analist" || node == "starter_agent") {
            console.log(JSON.stringify(values));
          }
          res.write(`data: ${JSON.stringify({ node, values })}\n\n`);
        }
      }

      // Notify completion
      res.write(`data: ${JSON.stringify({ status: "completed" })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Error streaming data:", error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  };
}


export { AiAgentController };
