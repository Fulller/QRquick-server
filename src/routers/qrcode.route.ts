import { Router, Request, Response, NextFunction } from "express";
import { ensureAuthenticated } from "../middlewares";
import _ from "lodash";
import { upload } from "../helpers/multer";
import { qrcodeController } from "../controllers";
import { createQRWithOwner } from "../middlewares";

const qrCodeRouter: Router = Router();

qrCodeRouter.get("/owner", qrcodeController.getQrcodeAndCustomByOwnerId);
qrCodeRouter.get("/custom/:id", qrcodeController.getQrcodeAndCustomById);
qrCodeRouter.get("/:id", qrcodeController.getById);
qrCodeRouter.post(
  "/create",
  upload.single("file"),
  createQRWithOwner,
  qrcodeController.create
);
qrCodeRouter.delete("/:id", qrcodeController.deleteById);

export { qrCodeRouter };
