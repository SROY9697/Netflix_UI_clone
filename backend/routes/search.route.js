import express from "express";

const router = express.Router();

import {
  searchMovie,
  searchPerson,
  searchTv,
  getSearchHistory,
  deleteItemFromSearchHistory,
} from "../controller/search.controller.js";

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);

router.get("/history", getSearchHistory);
router.delete("/history/:id", deleteItemFromSearchHistory);

export default router;
