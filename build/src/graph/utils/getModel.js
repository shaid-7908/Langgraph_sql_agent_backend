"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = void 0;
const groq_1 = require("@langchain/groq");
const env_config_1 = __importDefault(require("../../config/env.config"));
const getModel = () => {
    const model = new groq_1.ChatGroq({
        apiKey: env_config_1.default.GROQ_API_KEY,
        temperature: 0,
        model: "llama-3.3-70b-versatile",
    });
    return model;
};
exports.getModel = getModel;
