import jwt from "jsonwebtoken";
import envConfig from "../config/env.config";


const generateToken= (id:number)=>{

return jwt.sign({id},envConfig.JWT_SECRET,{expiresIn:'2h'})

}