const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch((err) => {
    console.error("Error connecting to Mongo", err);
  });

app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/post");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log("Backend is running");
});
