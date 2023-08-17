import jwt from "jsonwebtoken";
import configs from "../configs";
import createHttpError from "http-errors";
import _ from "lodash";
import { RefreshToken } from "../models";
import { isJSDocNonNullableType } from "typescript";

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
    sign: async (payload: any, userId: string) => {
      try {
        const token: string = jwt.sign(payload, REFRESH_SECRECT_KEY, {
          expiresIn: REFRESH_EX,
          algorithm: "HS256",
        });
        const expiresAt = new Date(Date.now() + REFRESH_EX * 1000);
        await RefreshToken.findOneAndUpdate(
          { userId },
          {
            token,
            userId,
            expiresAt,
          },
          { upsert: true }
        );
        return token;
      } catch {
        return "";
      }
    },
    verify: async (tokenString: string) => {
      try {
        const refreshToken: any = jwt.verify(tokenString, REFRESH_SECRECT_KEY);
        const storedRefreshToken = await RefreshToken.findOne({
          userId: refreshToken.id,
          token: tokenString,
        });
        if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
          return null;
        }
        return refreshToken;
      } catch {
        return null;
      }
    },
    delete: async (userId: string) => {
      await RefreshToken.deleteOne({ userId });
    },
  },
  refreshToken: async function (refreshTokenString: string) {
    if (!refreshTokenString) {
      throw createHttpError(403, "No refreshToken");
    }
    const validRefreshToken = await JWTService.refresh.verify(
      refreshTokenString
    );
    if (!validRefreshToken) {
      throw createHttpError(403, "RefreshToken invalid");
    }
    const accessToken = await JWTService.access.sign(
      _.pick(validRefreshToken, ["id", "displayName", "emails", "photos"])
    );
    if (!accessToken) {
      throw createHttpError(400, "Can not create access token");
    }
    return accessToken;
  },
};

export default JWTService;
