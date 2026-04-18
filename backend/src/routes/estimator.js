import express from "express";
import { runEstimateFromRequestBody } from "../services/costEstimator.js";

export const estimatorRouter = express.Router();

estimatorRouter.post("/estimate", async (req, res, next) => {
  try {
    const payload = runEstimateFromRequestBody(req.body);
    return res.json(payload);
  } catch (err) {
    return next(err);
  }
});
