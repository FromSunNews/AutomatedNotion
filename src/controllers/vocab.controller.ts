import { VocabService } from "../services/vocab.service";
import { HttpStatusCode } from "../utilities/constants";
import { Request, Response } from "express";

const handleAutomatedVocab = async (req: Request, res: Response) => {
  try {
    const result = await VocabService.handleAutomatedVocab(req.body);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json({
        errors: error.message,
      });
    }
  }
};

export const VocabController = {
  handleAutomatedVocab,
};
