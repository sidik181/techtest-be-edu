import { Response, NextFunction } from "express";

export interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data?: any;
}

export const successResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
): void => {
  const response: ApiResponse = {
    status,
    success: true,
    message,
    data,
  };

  res.status(status).json(response);
};
