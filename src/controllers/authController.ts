import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError";
import User from "../models/user";
import { generateToken } from "../lib/tokenManager";
import { successResponse } from "../helpers/responseHelper";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";

const SECRET_KEY = process.env.SECRET_KEY!;

export class AuthController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError("Email dan password harus diisi.");
      }

      const user = await User.findOne({ us_email: email });
      if (!user) {
        throw new ValidationError("User atau password salah.");
      }

      const isMatch = await bcrypt.compare(password, user.us_password);
      if (!isMatch) {
        throw new ValidationError("User atau password salah.");
      }

      const accessToken = await generateToken({ us_id: user.us_id }, "1h");

      return successResponse(res, 200, "Berhasil login", {
        token: accessToken,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  static async verify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new CustomError("Token tidak ditemukan", 401));
      }

      try {
        const isValid = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        return successResponse(res, 200, "Token valid", isValid.user);
      } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          return next(new CustomError("Token tidak valid", 401));
        }
        if (err instanceof jwt.TokenExpiredError) {
          return next(new CustomError("Token telah kadaluarsa", 401));
        }
        throw err;
      }
    } catch (error) {
      return next(error);
    }
  }
}
