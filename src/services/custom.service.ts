import { Custom } from "../models";
import createHttpError from "http-errors";
import _ from "lodash";

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
  edit: async (customData: any) => {
    try {
      const custom = await Custom.findById(_.get(customData, "_id", ""));
      if (!custom) {
        throw createHttpError(404);
      }
      const validEditFields = _.pickBy(customData, (_, key) =>
        custom.schema.path(key)
      );
      _.merge(custom, validEditFields);
      const editedCustom = await custom.save();
      return editedCustom;
    } catch (error: any) {
      throw createHttpError(error);
    }
  },
};
