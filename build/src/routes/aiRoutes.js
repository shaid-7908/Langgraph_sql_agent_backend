"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiAgentController_1 = require("../controllers/aiAgentController");
const aiRouter = express_1.default.Router();
aiRouter.post('/ask-ai', aiAgentController_1.AiAgentController.streamGraphResponse);
exports.default = aiRouter;
