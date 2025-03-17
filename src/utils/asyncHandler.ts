import { NextFunction,Request,Response,RequestHandler } from "express";

const asyncHandler = (handler:RequestHandler)=>(req:Request,res:Response,next:NextFunction)=>{
    try{
         return handler(req,res,next)
    }catch(error:any){
          res.status(error?.code || 5000).json({
            success: false,
            message: error.message,
          });
        next(error)
    }
}

export default asyncHandler