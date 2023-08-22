import { QRCode } from "../models";
import { customService, contentService } from "./index";
import _ from "lodash";
import createHttpError from "http-errors";
import { ContentTypeEnum } from "../constants/contentType.const";
import { isLeftHandSideExpression } from "typescript";

export default {
  create: async (qrCodeData) => {
    try {
      const newCustom = await customService.create();
      const newContent = await contentService.create(
        _.pick(qrCodeData, ["contentType", "data"])
      );
      qrCodeData = _.chain(qrCodeData)
        .set("custom", newCustom._id)
        .set("content", newContent._id)
        .set("name", qrCodeData.name === "null" ? "QR code" : qrCodeData.name)
        .pick(["name", "contentType", "content", "custom", "ownerId"])
        .value();
      const savedQRCode = await QRCode.create(qrCodeData);
      return savedQRCode;
    } catch (error: any) {
      throw createHttpError(error);
    }
  },
  getQrcodeAndCustomById: async (id) => {
    try {
      let qrCode = await QRCode.findOne({ _id: id, deleted: false }).populate(
        "custom"
      );
      if (qrCode && _.get(qrCode, "contentType") === "wifi") {
        qrCode = await qrCode.populate("content");
      }
      if (!qrCode) {
        throw createHttpError(404);
      }
      return qrCode;
    } catch (error: any) {
      throw createHttpError(400);
    }
  },
  getById: async (id) => {
    try {
      let qrCode = await QRCode.findOne({ _id: id, deleted: false });
      if (!qrCode) {
        throw createHttpError(404);
      }
      switch (qrCode.contentType) {
        case ContentTypeEnum.LINK: {
          qrCode = await qrCode.populate("content");
          break;
        }
      }
      qrCode.totalScan++;
      await qrCode.save();
      return qrCode;
    } catch (error: any) {
      throw createHttpError(400);
    }
  },
  getQrcodeAndCustomByOwnerId: async (ownerId) => {
    try {
      const qrCodes = await QRCode.find({ ownerId, deleted: false }).populate(
        "custom"
      );
      if (!qrCodes) {
        throw createHttpError(404);
      }
      return qrCodes;
    } catch (error: any) {
      throw createHttpError(400);
    }
  },
  deleteById: async (id) => {
    try {
      let qrCode = await QRCode.findById(id);
      if (!qrCode) {
        throw createHttpError(404);
      }
      qrCode.deleted = true;
      await qrCode.save();
      return qrCode;
    } catch (error: any) {
      throw createHttpError(400);
    }
  },
};
