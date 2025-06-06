import express from "express";

const router = express.Router();
import {
  getTvTrailers,
  getTrendingTv,
  getTvDetails,
  getSimilarTvs,
  getTvsByCategory,
} from "../controller/tv.controller.js";

//routes
router.get("/trending", getTrendingTv);
router.get("/:id/trailers", getTvTrailers);
router.get("/:id/details", getTvDetails);
router.get("/:id/similar", getSimilarTvs);
router.get("/:category", getTvsByCategory);

export default router;
