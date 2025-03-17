import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import envConfig from "./env.config";
import { UserTable } from "../drizzle/schema/user.schema";
import {db} from '../config/dbConnect'
import { eq } from "drizzle-orm";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: envConfig.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options,async (jwt_payload, done) => {
    const user = await db.select().from(UserTable).where(eq(UserTable.id,jwt_payload.id))
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  })
);

export default passport;
