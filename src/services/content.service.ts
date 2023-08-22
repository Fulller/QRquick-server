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
        case ContentTypeEnum.LINK:
        case ContentTypeEnum.WIFI: {
          content = await Content.create({ data });
          break;
        }
        case ContentTypeEnum.IMAGE:
        case ContentTypeEnum.AUDIO:
        case ContentTypeEnum.PDF: {
          content = await Content.create({
            dataFile: data.buffer,
            detail: _.omit(data, ["buffer"]),
          });
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
};
