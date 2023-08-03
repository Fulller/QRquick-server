import { Request, Response, NextFunction } from "express";
import QrcodeService from "../services/qrcode.service";
import _ from "lodash";
import { ContentTypeEnum } from "../constants/contentType.const";
import { apiVersion } from "../constants/api.const";

export default {
  create: async (req: any, res: any, next: NextFunction) => {
    try {
      const file = req.file;
      let qrcodeData = _.pick(req.body, [
        "name",
        "contentType",
        "data",
        "ownerId",
      ]);
      if (!!file) {
        const size = file.size;
        if (size > 1024 * 1024 * 10) {
          return res.fly({
            status: 400,
            message: "File size is larger than limit",
          });
        }
        qrcodeData = _.set(qrcodeData, "data", file);
      }
      const newQRcode = await QrcodeService.create(qrcodeData);
      res.fly({
        status: 201,
        metadata: newQRcode,
      });
    } catch (err) {
      res.fly({ status: 400 });
    }
  },
  getQrcodeAndCustomById: async (req: any, res: any, next: NextFunction) => {
    try {
      const id = _.get(req, "params.id");
      const qrCode = await QrcodeService.getQrcodeAndCustomById(id);
      res.fly({
        status: 200,
        metadata: qrCode,
      });
    } catch (err: any) {
      res.fly({ status: 404 });
    }
  },
  getById: async (req: any, res: any, next: NextFunction) => {
    try {
      const id = _.get(req, "params.id");
      const qrCode = await QrcodeService.getById(id);
      let redirect: string = "/";
      switch (qrCode.contentType) {
        case ContentTypeEnum.LINK: {
          redirect = _.get(qrCode, "content.data", "/");
          break;
        }
        case ContentTypeEnum.AUDIO:
        case ContentTypeEnum.IMAGE:
        case ContentTypeEnum.PDF: {
          redirect = `${apiVersion}/content/file/${qrCode.content}`;
          break;
        }
      }
      res.redirect(redirect);
    } catch (err: any) {
      res.fly({ status: 404 });
    }
  },
  getQrcodeAndCustomByOwnerId: async (
    req: any,
    res: any,
    next: NextFunction
  ) => {
    try {
      const ownerId = _.get(req, "profile.id");
      if (!ownerId) {
        return res.fly({ status: 403 });
      }
      const qrCodes = await QrcodeService.getQrcodeAndCustomByOwnerId(ownerId);
      res.fly({
        status: 200,
        metadata: qrCodes,
      });
    } catch (err: any) {
      res.fly({ status: 404 });
    }
  },
  deleteById: async (req: any, res: any, next: NextFunction) => {
    try {
      const id = _.get(req, "params.id");
      await QrcodeService.deleteById(id);
      res.fly({ status: 200 });
    } catch (err: any) {
      res.fly({ status: 400 });
    }
  },
};
