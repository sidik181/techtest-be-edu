import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY!;

export async function generateToken(payload: object, expiresIn: string) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token tidak ditemukan" });
    return;
  }

  jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors | null, user: any | undefined) => {
    if (err) {
      res.status(403).json({ message: "Token tidak valid" });
      return;
    }

    (req as any).user = user;
    next();
  });
};
