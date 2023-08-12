import { authRouter } from "./auth.router";
import { apiRouter } from "./api.router";
import { Router } from "express";
import { apiVersion } from "../constants/api.const";

const router: Router = Router();

router.get("/ping", (req, res: any) => {
  res.fly({ status: 200, message: "PONG" });
});
router.use("/", authRouter);
router.use(apiVersion, apiRouter);

export default router;
