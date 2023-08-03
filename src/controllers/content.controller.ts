import { Request, Response, NextFunction } from "express";
import ContentService from "../services/content.service";
import _ from "lodash";

export default {
  getFile: async (req: any, res: any, next: NextFunction) => {
    try {
      const id = _.get(req, "params.id");
      let { dataFile, detail } = await ContentService.getFile(id);
      res.setHeader("Content-Type", detail.mimetype);
      res.send(dataFile);
    } catch (err) {
      res.fly({ status: 404, message: "Not found file" });
    }
  },
};
