import { NextFunction,Request,Response,RequestHandler } from "express";

const asyncHandler =
  (handler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };


export default asyncHandler