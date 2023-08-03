import { authRouter } from "./auth.router";
import { apiRouter } from "./api.router";
import { Router } from "express";
import { apiVersion } from "../constants/api.const";

const router: Router = Router();

router.use("/", authRouter);
router.use(apiVersion, apiRouter);

export default router;
