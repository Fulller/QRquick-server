import dotenv from "dotenv";
import _ from "lodash";
dotenv.config();

interface Config {
  app: {
    port: number | undefined;
    sessionSecret: string | undefined;
    apiVersion: number | undefined;
    serverUrl: string | undefined;
  };
  db: {
    url: string | undefined;
  };
  auth: {
    google: {
      clientID: string | undefined;
      clientSecret: string | undefined;
    };
    clientUrl: string | undefined;
  };
  jwt: {
    ACCESS_SECRECT_KEY: string | undefined;
    REFRESH_SECRECT_KEY: string | undefined;
    ACCESS_EX: string | undefined;
    REFRESH_EX: string | undefined;
  };
}
const DEV_CONFIG: Config = {
  app: {
    port: _.chain(process.env).get("DEV_APP_PORT").toNumber().value(),
    sessionSecret: _.get(process.env, "DEV_APP_SESSTIONSECRET"),
    apiVersion: _.chain(process.env).get("DEV_API_VERSION").toNumber().value(),
    serverUrl: _.get(process.env, "DEV_APP_SERVERURL"),
  },
  db: {
    url: _.get(process.env, "DEV_DB_URL"),
  },
  auth: {
    google: {
      clientID: _.get(process.env, "DEV_AUTH_GOOGLE_CLIENTID"),
      clientSecret: _.get(process.env, "DEV_AUTH_GOOGLE_CLIENTSECRET"),
    },
    clientUrl: _.get(process.env, "DEV_AUTH_CLIENTURL"),
  },
  jwt: {
    ACCESS_SECRECT_KEY: _.get(process.env, "DEV_JWT_ACCESS_SECRECT_KEY"),
    REFRESH_SECRECT_KEY: _.get(process.env, "DEV_JWT_REFRESH_SECRECT_KEY"),
    ACCESS_EX: _.get(process.env, "DEV_JWT_ACCESS_EX"),
    REFRESH_EX: _.get(process.env, "DEV_JWT_REFRESH_EX"),
  },
};
const PRO_CONFIG: Config = {
  app: {
    port: _.chain(process.env).get("PRO_APP_PORT").toNumber().value(),
    sessionSecret: _.get(process.env, "PRO_APP_SESSTIONSECRET"),
    apiVersion: _.chain(process.env).get("PRO_API_VERSION").toNumber().value(),
    serverUrl: _.get(process.env, "PRO_APP_SERVERURL"),
  },
  db: {
    url: _.get(process.env, "PRO_DB_URL"),
  },
  auth: {
    google: {
      clientID: _.get(process.env, "PRO_AUTH_GOOGLE_CLIENTID"),
      clientSecret: _.get(process.env, "PRO_AUTH_GOOGLE_CLIENTSECRET"),
    },
    clientUrl: _.get(process.env, "PRO_AUTH_CLIENTURL"),
  },
  jwt: {
    ACCESS_SECRECT_KEY: _.get(process.env, "PRO_JWT_ACCESS_SECRECT_KEY"),
    REFRESH_SECRECT_KEY: _.get(process.env, "PRO_JWT_REFRESH_SECRECT_KEY"),
    ACCESS_EX: _.get(process.env, "PRO_JWT_ACCESS_EX"),
    REFRESH_EX: _.get(process.env, "PRO_JWT_REFRESH_EX"),
  },
};
const envName: string = _.toUpper(_.get(process.env, "NODE_ENV", "DEV"));
export default {
  DEV: DEV_CONFIG,
  PRO: PRO_CONFIG,
}[envName];
