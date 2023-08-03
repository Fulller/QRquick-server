import { Router, Request, Response, NextFunction } from "express";
import { ensureAuthenticated } from "../middlewares";
import _ from "lodash";
import { qrCodeRouter } from "./qrcode.route";
import { contentRouter } from "./content.route";

const apiRouter: Router = Router();

apiRouter.use("/qrcode", qrCodeRouter);
apiRouter.use("/content", contentRouter);

export { apiRouter };
