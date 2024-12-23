import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import User from "./src/models/user";
import Category from "./src/models/category";
import Product from "./src/models/product";
import Order from "./src/models/order";

dotenv.config({ path: "./.env" });

const MONGO_USERNAME = process.env.MONGO_USERNAME!;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD!;
const MONGO_DATABASE = process.env.MONGO_DATABASE!;
const MONGO_APPNAME = process.env.MONGO_APPNAME!;

mongoose
  .connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@eduwork.pl1oun4.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority&appName=${MONGO_APPNAME}`
  )
  .then(() => console.log("Terhubung ke database"))
  .catch((err) => console.error("Koneksi database gagal:", err));

const seedDatabase = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Dummy Users
    const users = Array.from({ length: 50 }).map(() => {
      const createdAt = faker.date.between({
        from: "2024-01-01",
        to: "2024-11-30",
      });
      return {
        us_id: uuidv4(),
        us_name: faker.person.fullName(),
        us_email: faker.internet.email(),
        us_password: faker.internet.password(),
        us_phone_number: faker.string.numeric({ length: { min: 10, max: 13 } }),
        us_address: faker.location.streetAddress(),
        us_created_at: createdAt,
        us_updated_at: createdAt,
      };
    });
    await User.insertMany(users);

    // Dummy Categories
    const categories = Array.from({ length: 5 }).map(() => {
      const createdAt = faker.date.between({
        from: "2024-01-01",
        to: "2024-11-30",
      });
      return {
        ct_id: uuidv4(),
        ct_code: faker.string.alphanumeric({ length: { min: 3, max: 5 } }),
        ct_name: faker.food.adjective(),
        ct_created_at: createdAt,
        ct_updated_at: createdAt,
      };
    });
    const insertedCategories = await Category.insertMany(categories);

    // Dummy Products
    const products = Array.from({ length: 100 }).map(() => {
      const createdAt = faker.date.between({
        from: "2024-01-01",
        to: "2024-11-30",
      });
      return {
        pd_id: uuidv4(),
        pd_code: faker.string.alphanumeric({ length: { min: 3, max: 5 } }),
        pd_ct_id: faker.helpers.arrayElement(insertedCategories)._id,
        pd_name: faker.commerce.productName(),
        pd_price: faker.number.int({ min: 1000, max: 100000 }),
        pd_created_at: createdAt,
        pd_updated_at: createdAt,
      };
    });
    const insertedProducts = await Product.insertMany(products);

    // Dummy Orders
    const orders = Array.from({ length: 200 }).map(() => {
      const randomProduct = faker.helpers.arrayElement(insertedProducts);
      // const randomProducts = faker.helpers.arrayElements(
      //   insertedProducts,
      //   faker.number.int({ min: 1, max: 5 })
      // );
      // const totalAmount = randomProducts.reduce(
      //   (sum, product) => sum + product.pd_price,
      //   0
      // );
      const randomQty = faker.number.int({ min: 1, max: 10 });
      const totalAmount = randomQty * randomProduct.pd_price;
      const createdAt = faker.date.between({
        from: "2024-01-01",
        to: "2024-11-30",
      });

      return {
        or_id: uuidv4(),
        or_pd_id: randomProduct,
        // or_pd_id: randomProducts.map((product) => product._id),
        or_amount: totalAmount,
        or_created_at: createdAt,
        or_updated_at: createdAt,
      };
    });
    await Order.insertMany(orders);

    console.log("Data dummy berhasil ditambahkan!");
  } catch (error) {
    console.error("Gagal menambahkan data dummy:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
