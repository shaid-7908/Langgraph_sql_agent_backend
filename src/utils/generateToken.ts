import jwt from "jsonwebtoken";
import envConfig from "../config/env.config";


const generateAccessToken= (id:number)=>{

return jwt.sign({id},envConfig.JWT_ACCESSTOKEN_SECRET,{expiresIn:'2h'})

}
const generateRefreshToken=(id:number)=>{
    return jwt.sign({'id':id},envConfig.JWT_REFRESHTOKEN_SECRET,{expiresIn:'10d'})
}

export {generateAccessToken,generateRefreshToken}