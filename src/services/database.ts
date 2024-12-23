import mongoose from "mongoose";

const MONGO_USERNAME = process.env.MONGO_USERNAME!;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD!;
const MONGO_DATABASE = process.env.MONGO_DATABASE!;
const MONGO_APPNAME = process.env.MONGO_APPNAME!;

mongoose
  .connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@eduwork.pl1oun4.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority&appName=${MONGO_APPNAME}`
  )
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error: Error) => {
    console.log("Unable to connect to MongoDB Atlas!", error.message);
  });
