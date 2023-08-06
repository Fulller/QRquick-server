import { Router, query } from "express";
import passport from "passport";
import configs from "../configs";
import _ from "lodash";

const authRouter = Router();

const clientUrl: string = _.get(
  configs,
  "auth.clientUrl",
  "http://localhost:3003"
);
authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: clientUrl,
    failureRedirect: clientUrl + "/login",
  })
  // (req: any, res) => {
  //   res.setHeader("Access-Control-Allow-Origin", clientUrl);
  //   res.setHeader("Access-Control-Allow-Credentials", "true");
  //   res.redirect(clientUrl);
  // }
);
authRouter.get("/logout", (req: any, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(clientUrl);
  });
});
authRouter.get("/user", (req, res: any) => {
  if (req.isAuthenticated()) {
    res.fly({
      status: 200,
      metadata: {
        user: _.pick(req.user, ["id", "displayName", "emails", "photos"]),
      },
    });
  } else {
    res.fly({
      status: 400,
      metadata: {
        user: null,
      },
    });
  }
});

export { authRouter };
