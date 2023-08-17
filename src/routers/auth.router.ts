import { Router, query } from "express";
import passport from "passport";
import configs from "../configs";
import _ from "lodash";
import JWTService from "../services/jwt.service";
import { profileAuthenticated } from "../middlewares";
import { authController } from "../controllers";

const authRouter = Router();

const clientUrl: string = _.get(
  configs,
  "auth.clientUrl",
  "http://localhost:3000"
);

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: clientUrl + "/login",
  }),
  authController.googleCallBack
);
authRouter.get("/logout", profileAuthenticated, authController.logOut);
authRouter.get("/profile", profileAuthenticated, authController.profile);
authRouter.get("/refreshtoken", authController.refreshToken);

export { authRouter };
