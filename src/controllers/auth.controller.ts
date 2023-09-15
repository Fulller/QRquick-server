import configs from "../configs";
import _ from "lodash";
import JWTService from "../services/jwt.service";

const clientUrl: string = _.get(
  configs,
  "auth.clientUrl",
  "http://localhost:3000"
);

export default {
  googleCallBack: async (req, res) => {
    const accessToken = await JWTService.access.sign(
      _.pick(req.user, ["id", "displayName", "emails", "photos"])
    );
    const refreshToken = await JWTService.refresh.sign(
      _.pick(req.user, ["id", "displayName", "emails", "photos"]),
      _.get(req.user, "id", "")
    );
    console.log({
      clientUrl: `${clientUrl}/login?accesstoken=${accessToken}&refreshtoken=${refreshToken}`,
    });
    res.redirect(
      `${clientUrl}/login?accesstoken=${accessToken}&refreshtoken=${refreshToken}`
    );
  },
  logOut: async (req: any, res: any, next) => {
    try {
      const userId: string = _.get(req, "profile.id", "");
      await JWTService.refresh.delete(userId);
      res.fly({ status: 200, message: "Logout successful" });
    } catch (err: any) {
      res.fly(err);
    }
  },
  profile: async (req: any, res: any) => {
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
  },
  refreshToken: async (req: any, res: any) => {
    try {
      const refreshToken: string = _.get(req.headers, "refreshtoken", "");
      if (!refreshToken) {
        return res.fly({ status: 403 });
      }
      const accessToken = await JWTService.refreshToken(refreshToken);
      res.fly({ status: 200, metadata: { accessToken } });
    } catch (err: any) {
      res.fly(err);
    }
  },
};
