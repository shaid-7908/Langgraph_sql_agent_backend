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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentController = void 0;
const graph_1 = require("../graph/graph");
class AiAgentController {
}
exports.AiAgentController = AiAgentController;
_a = AiAgentController;
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
AiAgentController.streamGraphResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
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
        try {
            //Stream data using callableGraph.stream
            for (var _e = true, _f = __asyncValues(yield graph_1.callableGraph.stream({ messages }, Object.assign(Object.assign({}, config), { streamMode: "updates" }))), _g; _g = yield _f.next(), _b = _g.done, !_b; _e = true) {
                _d = _g.value;
                _e = false;
                const chunk = _d;
                for (const [node, values] of Object.entries(chunk)) {
                    console.log(`Sending update from node: ${node}`);
                    if (node == "data_analist" || node == "starter_agent") {
                        console.log(JSON.stringify(values));
                    }
                    res.write(`data: ${JSON.stringify({ node, values })}\n\n`);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = _f.return)) yield _c.call(_f);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Notify completion
        res.write(`data: ${JSON.stringify({ status: "completed" })}\n\n`);
        res.end();
    }
    catch (error) {
        console.error("Error streaming data:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});
