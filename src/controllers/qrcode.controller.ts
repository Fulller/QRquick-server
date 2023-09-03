import { Request, Response, NextFunction } from "express";
import { qrcodeService, customService } from "../services";
import _ from "lodash";
import { ContentTypeEnum } from "../constants/contentType.const";
import { apiVersion } from "../constants/api.const";
import configs from "../configs";

const clientUrl: string = _.get(configs, "auth.clientUrl", "/");

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
      } else {
        qrcodeData.data = JSON.parse(qrcodeData.data);
      }
      const newQRcode = await qrcodeService.create(qrcodeData);
      res.fly({
        status: 201,
        metadata: newQRcode,
      });
    } catch (err: any) {
      res.fly({ status: err.status });
    }
  },
  getQrcodeAndCustomById: async (req: any, res: any, next: NextFunction) => {
    try {
      const id = _.get(req, "params.id");
      const qrCode = await qrcodeService.getQrcodeAndCustomById(id);
      const ownerIdBody: string | null = _.get(req, "body.ownerId", null);
      const ownerIdQr: string | null = _.get(qrCode, "ownerId", null);

      if (
        (ownerIdQr && !ownerIdBody) ||
        (ownerIdQr && ownerIdBody !== ownerIdQr)
      ) {
        return res.fly({
          status: 403,
        });
      }
      res.fly({
        status: 200,
        metadata: qrCode,
      });
    } catch (err: any) {
      res.fly({ status: err.status });
    }
  },
  getById: async (req: any, res: any, next: NextFunction) => {
    try {
      const id = _.get(req, "params.id");
      const qrCode = await qrcodeService.getById(id);
      let redirect: string = "/ping";
      switch (qrCode.contentType) {
        case ContentTypeEnum.LINK: {
          redirect = _.get(qrCode, "content.data.link", "/");
          break;
        }
        case ContentTypeEnum.AUDIO:
        case ContentTypeEnum.IMAGE:
        case ContentTypeEnum.PDF:
        case ContentTypeEnum.FILE: {
          redirect = `${apiVersion}/content/file/${qrCode.content}`;
          break;
        }
        case ContentTypeEnum.TEXT: {
          redirect = `${clientUrl}/content/text/${qrCode.content}`;
          break;
        }
        default: {
          return res.fly({ status: 404, message: "Not found content" });
        }
      }
      res.redirect(redirect);
    } catch (err: any) {
      res.fly({ status: err.status });
    }
  },
  getQrcodeAndCustomByOwnerId: async (
    req: any,
    res: any,
    next: NextFunction
  ) => {
    try {
      const ownerId = _.get(req, "body.ownerId");
      if (!ownerId) {
        return res.fly({ status: 403 });
      }
      const qrCodes = await qrcodeService.getQrcodeAndCustomByOwnerId(ownerId);
      res.fly({
        status: 200,
        metadata: qrCodes,
      });
    } catch (err: any) {
      res.fly({ status: err.status });
    }
  },
  deleteById: async (req: any, res: any, next: NextFunction) => {
    try {
      const id = _.get(req, "params.id");
      await qrcodeService.deleteById(id);
      res.fly({ status: 200 });
    } catch (err: any) {
      res.fly({ status: 400 });
    }
  },
  editCustom: async (req: any, res: any, next: NextFunction) => {
    try {
      const customData = _.get(req, "body.customData");
      await customService.edit(customData);
      res.fly({ status: 200 });
    } catch (err: any) {
      res.fly({ status: err.status });
    }
  },
};
