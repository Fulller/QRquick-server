import { Router, Request, Response, NextFunction } from "express";
import { ensureAuthenticated } from "../middlewares";
import _ from "lodash";
import { upload } from "../helpers/multer";
import { qrcodeController } from "../controllers";
import { bodyWithOwner } from "../middlewares";
import { profileAuthenticated } from "../middlewares";

const qrCodeRouter: Router = Router();

qrCodeRouter.get(
  "/owner",
  ensureAuthenticated,
  profileAuthenticated,
  bodyWithOwner,
  qrcodeController.getQrcodeAndCustomByOwnerId
);
qrCodeRouter.get(
  "/custom/:id",
  profileAuthenticated,
  bodyWithOwner,
  qrcodeController.getQrcodeAndCustomById
);
qrCodeRouter.get("/:id", qrcodeController.getById);
qrCodeRouter.post(
  "/create",
  upload.single("file"),
  profileAuthenticated,
  bodyWithOwner,
  qrcodeController.create
);
qrCodeRouter.delete("/:id", qrcodeController.deleteById);
qrCodeRouter.put("/", qrcodeController.editCustom);

export { qrCodeRouter };
