import express from "express";
import { VocabController } from "../../controllers/vocab.controller";
import { VocabValidation } from "../../validations/vocab.validation";

const router = express.Router();
router
  .route("/automated")
  .post(
    VocabValidation.handleAutomatedVocab,
    VocabController.handleAutomatedVocab
  );

export const vocabRoutes = router;
