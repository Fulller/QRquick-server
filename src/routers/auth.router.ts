import { Router, query } from "express";
import passport from "passport";
import configs from "../configs";
import _ from "lodash";
import JWTService from "../services/jwt.service";
import { profileAuthenticated } from "../middlewares";

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
  async (req, res) => {
    const accessToken = await JWTService.access.sign(
      _.pick(req.user, ["id", "displayName", "emails", "photos"])
    );
    res.redirect(`${clientUrl}/login?accesstoken=${accessToken}`);
  }
);
authRouter.get("/logout", (req: any, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(clientUrl);
  });
});
authRouter.get("/profile", profileAuthenticated, async (req: any, res: any) => {
  const profile = req.profile;
  if (profile) {
    res.fly({
      status: 200,
      metadata: {
        profile: _.pick(profile, ["id", "displayName", "emails", "photos"]),
      },
    });
  } else {
    res.fly({
      status: 400,
      metadata: {
        profile: null,
      },
    });
  }
});

export { authRouter };
