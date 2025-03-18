import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
):void => {
  console.error(err);

  // If the error is an instance of your custom ApiError, use its properties
  if (err.statusCode) {
     res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      data: err.data || null,
    });
    return
  }
  if (err.name === "MongoNetworkError" || err.code === "ECONNREFUSED") {
    res.status(503).json({
      success: false,
      message: "Database connection error. Please try again later.",
    });
    return;
  }
 
  // For other errors, use a generic response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

   res.status(statusCode).json({
    success: false,
    message,
  });
  return
};

export default errorHandler;
