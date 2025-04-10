"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../config/env.config"));
const generateAccessToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, env_config_1.default.JWT_ACCESSTOKEN_SECRET, { expiresIn: '2h' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ 'id': id }, env_config_1.default.JWT_REFRESHTOKEN_SECRET, { expiresIn: '10d' });
};
exports.generateRefreshToken = generateRefreshToken;
