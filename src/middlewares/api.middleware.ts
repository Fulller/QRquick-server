import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { responseDto } from "../dtos";
import { getStatus } from "../utils";
import { profileAuthenticated } from "../middlewares";
import _ from "lodash";

export function response(req: Request, res, next: NextFunction) {
  res.fly = function ({ status = 400, code, message, metadata }: responseDto) {
    this.status(status).json({
      status: getStatus(status),
      success: status >= 200 && status < 300,
      code,
      message,
      metadata,
    });
  };
  next();
}

export function notFound(req: Request, res) {
  res.fly({ status: 404, message: `Not found router '${req.url}'` });
}
export function handleError(err, req: Request, res, next: NextFunction) {
  res.fly({ status: err.status || 500, message: err.mesage });
}
export function createQRWithOwner(req: any, res, next) {
  const user = req.profile;
  if (!!user) {
    req.body.ownerId = _.get(user, "id", null);
  }
  next();
}
