import { Router, query } from "express";
import passport from "passport";
import configs from "../configs";
import _ from "lodash";
import JWTService from "../services/jwt.service";

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
    res.redirect(`${clientUrl}/login?accessToken=${accessToken}`);
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
authRouter.get("/user", async (req, res: any) => {
  try {
    const accessToken = req.cookies.accessToken;
    const user = await JWTService.access.verify(accessToken);
    console.log({ accessToken, user });
    res.fly({
      status: 200,
      metadata: {
        user: _.pick(user, ["id", "displayName", "emails", "photos"]),
      },
    });
  } catch {
    res.fly({
      status: 400,
      metadata: {
        user: null,
      },
    });
  }
});

export { authRouter };
