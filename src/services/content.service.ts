import { Content } from "../models";
import _ from "lodash";
import { ContentTypeEnum } from "../constants/contentType.const";
import createHttpError from "http-errors";

export default {
  create: async (contentData) => {
    try {
      const { contentType, data } = contentData;
      let content;
      switch (contentType) {
        case ContentTypeEnum.IMAGE:
        case ContentTypeEnum.AUDIO:
        case ContentTypeEnum.PDF:
        case ContentTypeEnum.FILE: {
          content = await Content.create({
            dataFile: data.buffer,
            detail: _.omit(data, ["buffer"]),
          });
          break;
        }
        default: {
          content = await Content.create({ data });
          break;
        }
      }
      return content;
    } catch {
      throw createHttpError(400);
    }
  },
  getFile: async (id) => {
    try {
      const file = await Content.findById(id);
      if (file?.detail?.fieldname !== "file") {
        throw createHttpError(404);
      }
      return file;
    } catch {
      throw createHttpError(400);
    }
  },
  getText: async (id) => {
    try {
      const textContent = await Content.findById(id);
      if (!textContent) {
        throw createHttpError(404);
      }
      return textContent;
    } catch {
      throw createHttpError(400);
    }
  },
};
