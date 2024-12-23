import { Request, Response, NextFunction } from "express";
import { successResponse } from "../helpers/responseHelper";
import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import Order from "../models/order";
import Product from "../models/product";

export class OrderController {
  static async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productItems } = req.body;

      if (!Array.isArray(productItems) || productItems.length === 0) {
        throw new ValidationError(
          "Produk harus berupa array dan tidak boleh kosong"
        );
      }

      const savedOrders = await Promise.all(
        productItems.map(
          async (product: { product_id: string; qty: number }) => {
            const { product_id, qty } = product;

            if (!product_id || typeof product_id !== "string") {
              throw new ValidationError(
                `ID produk harus diisi dan berupa string untuk item ${JSON.stringify(
                  product
                )}`
              );
            }

            if (!qty || typeof qty !== "number") {
              throw new ValidationError(
                `Jumlah order harus diisi dan berupa angka untuk item ${JSON.stringify(
                  product
                )}`
              );
            }

            const productData = await Product.findById(product_id);
            if (!productData) {
              throw new NotFoundError(
                `Produk dengan ID ${product_id} tidak ditemukan`
              );
            }

            const priceAmount = productData.pd_price * qty;
            const order = new Order({
              or_pd_id: productData._id,
              or_amount: priceAmount,
            });

            return order.save();
          }
        )
      );

      return successResponse(
        res,
        201,
        "Berhasil membuat order produk",
        savedOrders
      );
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orders = await Order.find().populate("or_pd_id", "pd_name");

      if (orders.length === 0) {
        return successResponse(res, 200, "Order tidak ada", {});
      }

      return successResponse(res, 200, "Berhasil mengambil data order", orders);
    } catch (error: any) {
      next(error);
    }
  }

  static async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idOrder } = req.params;

      const order = await Order.findById(idOrder);
      if (!order) {
        throw new NotFoundError("Order tidak ditemukan.");
      }

      return successResponse(res, 200, "Berhasil mengambil data order", order);
    } catch (error) {
      next(error);
    }
  }
}
