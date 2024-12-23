import { Request, Response, NextFunction } from "express";
import { successResponse } from "../helpers/responseHelper";
import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import Product from "../models/product";
import Category from "../models/category";
import Order from "../models/order";

export class ProductController {
  static async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { pd_code, pd_name, pd_ct_id, pd_price } = req.body;
      // const { code, name,category_id, price } = req.body;

      if (!pd_code || typeof pd_code !== "string") {
        throw new ValidationError("Kode produk harus diisi dan berupa teks");
      }

      if (!pd_name || typeof pd_name !== "string") {
        throw new ValidationError("Nama produk harus diisi dan berupa teks");
      }

      if (!pd_ct_id || typeof pd_ct_id !== "string") {
        throw new ValidationError(
          "Kategori produk harus diisi dan berupa ID kategori"
        );
      }

      if (!pd_price || typeof pd_price !== "number" || pd_price < 1000) {
        throw new ValidationError(
          "Harga produk harus diisi, berupa angka, dan lebih dari 1000"
        );
      }

      let category;
      if (pd_ct_id) {
        category = await Category.findById(pd_ct_id);
        if (!category) {
          throw new NotFoundError(
            "Kategori tidak ditemukan. Pastikan ID kategori valid."
          );
        }
      }

      const product = new Product({
        pd_code,
        pd_name,
        pd_ct_id: category?._id,
        pd_price,
      });

      await product.save();

      return successResponse(res, 201, "Produk berhasil ditambahkan", product);
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await Product.find().populate("pd_ct_id", "ct_name");

      if (products.length === 0) {
        return successResponse(res, 200, "Produk tidak ada", {});
      }

      return successResponse(
        res,
        200,
        "Berhasil mengambil data produk",
        products
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idProduct } = req.params;

      const product = await Product.findById(idProduct);
      if (!product) {
        throw new NotFoundError("Produk tidak ditemukan.");
      }

      return successResponse(
        res,
        200,
        "Berhasil mengambil data produk",
        product
      );
    } catch (error) {
      next(error);
    }
  }

  static async editProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idProduct } = req.params;
      const { pd_code, pd_name, pd_ct_id, pd_price } = req.body;

      const product = await Product.findById(idProduct);
      if (!product) {
        throw new NotFoundError("Produk tidak ditemukan.");
      }

      if ("pd_name" in req.body && typeof pd_name !== "string") {
        throw new ValidationError("Nama produk harus berupa teks");
      }

      if ("pd_code" in req.body && typeof pd_code !== "string") {
        throw new ValidationError("Kode produk harus berupa teks");
      }

      if ("pd_ct_id" in req.body && typeof pd_ct_id !== "string") {
        throw new ValidationError("Kategori produk harus berupa ID kategori");
      }

      if (
        "pd_price" in req.body &&
        (typeof pd_price !== "number" || pd_price < 1000)
      ) {
        throw new ValidationError(
          "Harga produk harus berupa angka dan lebih dari 1000"
        );
      }

      let category;
      if (pd_ct_id) {
        category = await Category.findById(pd_ct_id);
        if (!category) {
          throw new NotFoundError(
            "Kategori tidak ditemukan. Pastikan ID kategori valid."
          );
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        idProduct,
        {
          ...(pd_code && { pd_code }),
          ...(pd_name && { pd_name }),
          ...(pd_ct_id && { pd_ct_id: category?._id }),
          ...(pd_price && { pd_price }),
          pd_updated_at: Date.now(),
        },
        { new: true, runValidators: true }
      );

      return successResponse(
        res,
        200,
        "Produk berhasil diperbarui",
        updatedProduct
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idProduct } = req.params;

      const productWithOrder = await Order.findOne({ or_pd_id: idProduct });
      if (productWithOrder) {
        throw new ValidationError(
          "Produk memiliki riwayat transaksi, tidak dapat dihapus."
        );
      }

      const product = await Product.findByIdAndDelete(idProduct);
      if (!product) {
        throw new NotFoundError("Produk tidak ditemukan.");
      }

      return successResponse(res, 200, "Produk berhasil dihapus.");
    } catch (error) {
      next(error);
    }
  }

  static async deleteProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new ValidationError("Id produk harus diisi dan berupa array.");
      }

      const productsWithOrders = await Order.find({ or_pd_id: { $in: ids } });
      if (productsWithOrders.length > 0) {
        throw new ValidationError(
          "Beberapa produk tidak dapat dihapus karena sedang digunakan dalam transaksi."
        );
      }

      const deleteResults = await Promise.all(
        ids.map((id) => Product.findByIdAndDelete(id))
      );

      const notFoundIds = ids.filter((_, index) => !deleteResults[index]);
      if (notFoundIds.length > 0) {
        throw new NotFoundError(
          `Produk dengan id berikut tidak ditemukan: ${notFoundIds.join(", ")}`
        );
      }

      return successResponse(res, 200, "Produk berhasil dihapus.");
    } catch (error) {
      next(error);
    }
  }
}
