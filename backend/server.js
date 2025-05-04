import express from "express";
const app = express();
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoute from "./routes/search.route.js";
import connectDB from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";
import cookieParser from "cookie-parser";

app.get("/", (req, res) => {
  res.send("working now");
});

import cors from "cors";
app.use(cors()); // Use this after the variable declaration
//we use this to get the data from req body
app.use(express.json());
app.use(cookieParser()); //to get the cookies from the req body

//router
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoute);

//db connection
connectDB();

app.listen(5000, () => {
  console.log("server is running at 5000");
});
