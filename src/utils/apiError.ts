class ApiError extends Error {
  statusCode: number;
  data: unknown;
  message: string;
  success: boolean;
  errors: unknown[]; // Changed from never[] to unknown[]

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    data: unknown = null,
    errors: unknown[] = [], // Updated type here as well
    stack = ""
  ) {
    super();
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
