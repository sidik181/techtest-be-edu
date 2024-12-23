import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../helpers/responseHelper";
import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import User from "../models/user";

export class UserController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { us_name, us_email, us_password, us_phone_number, us_address } = req.body;

      if (!us_name || typeof us_name !== "string") {
        throw new ValidationError("Nama harus diisi dan berupa teks");
      }

      if (!us_email || typeof us_email !== "string") {
        throw new ValidationError("Email harus diisi dan berupa email valid");
      }

      if (!us_password || typeof us_password !== "string") {
        throw new ValidationError("Password harus diisi dan berupa teks");
      }

      if (!us_phone_number || typeof us_phone_number !== "string") {
        throw new ValidationError("Nomor telepon harus diisi");
      }

      if (!us_address || typeof us_address !== "string") {
        throw new ValidationError("Alamat harus diisi dan berupa teks");
      }

      const hashedPassword = await bcrypt.hash(us_password, 10);

      const user = new User({
        us_name,
        us_email,
        us_password: hashedPassword,
        us_phone_number,
        us_address,
      });

      await user.save();

      return successResponse(res, 201, "Produk berhasil ditambahkan", user);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await User.find();

      if (users.length === 0) {
        return successResponse(res, 200, "User tidak ada", {});
      }

      return successResponse(res, 200, "Berhasil mengambil data user", users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idUser } = req.params;

      const user = await User.findById(idUser);
      if (!user) {
        throw new NotFoundError("User tidak ditemukan");
      }

      return successResponse(res, 200, "Berhasil mengambil data user", user);
    } catch (error) {
      next(error);
    }
  }

  static async editUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idUser } = req.params;
      const { us_name, us_email, us_password, us_phone_number, us_address } = req.body;

      const user = await User.findById(idUser);
      if (!user) {
        throw new NotFoundError("User tidak ditemukan");
      }

      if (!us_name || typeof us_name !== "string") {
        throw new ValidationError("Nama harus diisi dan berupa teks");
      }

      if (!us_email || typeof us_email !== "string") {
        throw new ValidationError("Email harus diisi dan berupa email valid");
      }

      if (!us_password || typeof us_password !== "string") {
        throw new ValidationError("Password harus diisi dan berupa teks");
      }

      if (!us_phone_number || typeof us_phone_number !== "string") {
        throw new ValidationError("Nomor telepon harus diisi");
      }

      if (!us_address || typeof us_address !== "string") {
        throw new ValidationError("Alamat harus diisi dan berupa teks");
      }

      let hashedPassword;
      if (us_password) {
        hashedPassword = await bcrypt.hash(us_password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        idUser,
        {
          ...(us_name && { us_name }),
          ...(us_email && { us_email}),
          ...(us_password && { us_password: hashedPassword }),
          ...(us_phone_number && { us_phone_number }),
          ...(us_address && { us_address }),
          us_updated_at: Date.now(),
        },
        { new: true, runValidators: true }
      );

      return successResponse(res, 200, "User berhasil diperbarui", updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idUser } = req.params;

      const user = await User.findByIdAndDelete(idUser);
      if (!user) {
        throw new NotFoundError("User tidak ditemukan");
      }

      return successResponse(res, 200, "User berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }

  static async deleteUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {ids} = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new ValidationError("Id pengguna harus diisi dan berupa array.");
      }

      const deleteResults = await Promise.all(
        ids.map((id) => User.findByIdAndDelete(id))
      );

      const notFoundIds = ids.filter((_, index) => !deleteResults[index]);
      if (notFoundIds.length > 0) {
        throw new NotFoundError(
          `Pengguna dengan id berikut tidak ditemukan: ${notFoundIds.join(", ")}`
        );
      }

      return successResponse(res, 200, "User berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
}
