import express from "express";
import { vocabRoutes } from "./vocab.route";

const router = express.Router();

// vocab
router.use("/vocab", vocabRoutes);

export const apiV1 = router;
