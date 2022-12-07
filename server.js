import express from "express";
import routes from "./src/routes";
import { APP_PORT, DATABASE_URL, MONGO_ATLAS } from "./src/config";
import mongoose from "mongoose";
import { errorHandler } from "./src/middlewares";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);
//middleware
app.use(errorHandler);
//json and multipart
app.use(express.urlencoded({ extended: false }));

//db
mongoose.connect(MONGO_ATLAS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "DataBase connection error!!"));
db.once("open", () => {
  console.log("DataBase Connected Successfully !!");
});

const __dirname = path.resolve();

//json and multipart
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//static files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(express.static(path.join(__dirname, "/frontend/build")));
//global variable
global.appRoot = path.resolve(__dirname);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});
const port = process.env.PORT || APP_PORT;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
