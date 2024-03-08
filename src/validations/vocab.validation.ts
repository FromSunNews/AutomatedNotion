import Joi from "joi";
import { HttpStatusCode } from "../utilities/constants";
import { NextFunction, Request, Response } from "express";

const handleAutomatedVocab = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🚀 ~ handleAutomatedVocab ~ req:", req.body);

  const condition = Joi.object({
    vocabs: Joi.string().required(),
    title: Joi.string().required()
  });

  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        errors: error,
      });
    }
  }
};

export const VocabValidation = {
  handleAutomatedVocab,
};
