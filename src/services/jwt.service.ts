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
const ACCESS_EX: number = _.chain(configs)
  .get("jwt.ACCESS_EX", "60")
  .toNumber()
  .value();
const REFRESH_EX: number = _.chain(configs)
  .get("jwt.REFRESH_EX", "120")
  .toNumber()
  .value();

const JWTService = {
  access: {
    sign: (payload: any): string => {
      try {
        return jwt.sign(payload, ACCESS_SECRECT_KEY, {
          expiresIn: ACCESS_EX,
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
          expiresIn: REFRESH_EX,
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
    const accessToken = JWTService.access.sign(validRefreshToken);
    if (!accessToken) {
      throw createHttpError(400, "Can not create access token");
    }
    return accessToken;
  },
};

export default JWTService;
