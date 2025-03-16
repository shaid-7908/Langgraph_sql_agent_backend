import {db} from '../config/dbConnect'
import { UserTable } from '../drizzle/schema/user.schema'
import bcrypt from 'bcrypt'

export const registerUserservice = async (name:string,email:string,password:string,username:string)=>{
 const hashpassword = await bcrypt.hash(password,10)
 try{

   const result = await db.insert(UserTable).values({
        name:name,
        email:email,
        password:hashpassword,
        username:username
    }).$returningId()
    return {success:true,message:result}
 }catch(error){
    console.error("Error registering user:", error);
    return { success: false, message: "User registration failed." };
 }
}