import { Request, Response, NextFunction } from "express";
import { successResponse } from "../helpers/responseHelper";
import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import Category from "../models/category";
import Product from "../models/product";

export class CategoryController {
  static async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ct_code, ct_name } = req.body;

      if (!ct_code || typeof ct_code !== "string") {
        throw new ValidationError("Kode kategori harus diisi dan berupa teks");
      }

      if (!ct_name || typeof ct_name !== "string") {
        throw new ValidationError("Nama kategori harus diisi dan berupa teks");
      }

      const category = new Category({ ct_code, ct_name });
      await category.save();

      return successResponse(
        res,
        201,
        "Kategori berhasil ditambahkan",
        category
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await Category.find();

      if (categories.length === 0) {
        return successResponse(res, 200, "Kategori tidak ada", {});
      }

      return successResponse(
        res,
        200,
        "Berhasil mengambil data kategori",
        categories
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idCategory } = req.params;

      const category = await Category.findById(idCategory);
      if (!category) {
        throw new NotFoundError("Kategori tidak ditemukan.");
      }

      return successResponse(
        res,
        200,
        "Berhasil mengambil data kategori",
        category
      );
    } catch (error) {
      next(error);
    }
  }

  static async editCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idCategory } = req.params;
      const { ct_code, ct_name } = req.body;

      const category = await Category.findById(idCategory);
      if (!category) {
        throw new NotFoundError("Kategori tidak ditemukan.");
      }

      if ("name" in req.body && typeof ct_name !== "string") {
        throw new ValidationError("Nama kategori harus berupa teks");
      }

      if ("code" in req.body && typeof ct_code !== "string") {
        throw new ValidationError("Kode kategori harus berupa teks");
      }

      const categoryUpdated = await Category.findByIdAndUpdate(
        idCategory,
        {
          ...(ct_code && { ct_code }),
          ...(ct_name && { ct_name }),
          ct_updated_at: Date.now(),
        },
        { new: true, runValidators: true }
      );

      return successResponse(
        res,
        200,
        "Kategori berhasil diperbarui",
        categoryUpdated
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idCategory } = req.params;

      const categoryWithProduct = await Product.findOne({
        pd_ct_id: idCategory,
      });
      if (categoryWithProduct) {
        throw new ValidationError(
          "Kategori memiliki produk terkait, tidak dapat dihapus."
        );
      }

      const category = await Category.findByIdAndDelete(idCategory);
      if (!category) {
        throw new NotFoundError("Kategori tidak ditemukan.");
      }

      return successResponse(res, 200, "Kategori berhasil dihapus.");
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new ValidationError("Id kategori harus diisi dan berupa array.");
      }

      const categoryWithProducts = await Product.find({ pd_ct_id: { $in: ids } });
      if (categoryWithProducts.length > 0) {
        throw new ValidationError(
          "Beberapa kategori tidak dapat dihapus karena memiliki produk terkait."
        );
      }

      const deleteResults = await Promise.all(
        ids.map((id) => Category.findByIdAndDelete(id))
      );

      const notFoundIds = ids.filter((_, index) => !deleteResults[index]);
      if (notFoundIds.length > 0) {
        throw new NotFoundError(
          `Kategori dengan id berikut tidak ditemukan: ${notFoundIds.join(", ")}`
        );
      }

      return successResponse(res, 200, "Kategori berhasil dihapus.");
    } catch (error) {
      next(error);
    }
  }
}
