import { Router, Request, Response, NextFunction } from "express";
import { ensureAuthenticated } from "../middlewares";
import _ from "lodash";
import { contentController } from "../controllers";

const contentRouter: Router = Router();
contentRouter.get("/file/:id", contentController.getFile);

export { contentRouter };
