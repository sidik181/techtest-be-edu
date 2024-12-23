import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      success: false,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }
};
