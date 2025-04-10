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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const env_config_1 = __importDefault(require("./env.config"));
const user_schema_1 = require("../drizzle/schema/user.schema");
const dbConnect_1 = require("../config/dbConnect");
const drizzle_orm_1 = require("drizzle-orm");
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env_config_1.default.JWT_ACCESSTOKEN_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(options, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield dbConnect_1.db.select().from(user_schema_1.UserTable).where((0, drizzle_orm_1.eq)(user_schema_1.UserTable.id, jwt_payload.id));
    if (user) {
        return done(null, user);
    }
    return done(null, false);
})));
exports.default = passport_1.default;
