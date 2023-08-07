import jwt from "jsonwebtoken";
import configs from "../configs";
import createHttpError from "http-errors";
import _ from "lodash";

const ACCESS_SECRECT_KEY: string = _.get(
  configs,
  "jwt.ACCESS_SECRECT_KEY",
  "access"
);
const REFRESH_SECRECT_KEY: string = _.get(
  configs,
  "jwt.REFRESH_SECRECT_KEY",
  "refresh"
);

const JWTService = {
  access: {
    sign: (payload: any): string => {
      try {
        return jwt.sign(payload, ACCESS_SECRECT_KEY, {
          expiresIn: 60,
          algorithm: "HS256",
        });
      } catch {
        return "";
      }
    },
    verify: (token: string): any | null => {
      try {
        return jwt.verify(token, ACCESS_SECRECT_KEY);
      } catch {
        throw createHttpError(400);
      }
    },
  },
  refresh: {
    sign: (payload: any): string => {
      try {
        return jwt.sign(payload, REFRESH_SECRECT_KEY, {
          expiresIn: 60 * 5,
          algorithm: "HS256",
        });
      } catch {
        return "";
      }
    },
    verify: (token: string): any | null => {
      try {
        return jwt.verify(token, REFRESH_SECRECT_KEY);
      } catch {
        return null;
      }
    },
  },
  refreshToken: function (refreshTokenString: string) {
    if (!refreshTokenString) {
      throw createHttpError(403, "No refreshToken");
    }
    const validRefreshToken = JWTService.refresh.verify(refreshTokenString);
    if (!validRefreshToken) {
      throw createHttpError(403, "RefreshToken invalid");
    }
    const accessToken = JWTService.access.sign(
      _.pick(validRefreshToken, ["id", "email"])
    );
    if (!accessToken) {
      throw createHttpError(400, "Can not create access token");
    }
    return {
      status: 200,
      metadata: {
        accessToken,
      },
    };
  },
};

export default JWTService;
