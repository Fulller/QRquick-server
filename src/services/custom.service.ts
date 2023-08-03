import { Custom } from "../models";
import createHttpError from "http-errors";

export default {
  create: async () => {
    try {
      const newCustom = new Custom();
      const savedCustom = await newCustom.save();
      return savedCustom;
    } catch (error: any) {
      throw createHttpError(error);
    }
  },
};
