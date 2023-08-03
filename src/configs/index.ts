// Config enviroment variable
import dotenv from "dotenv";
import _ from "lodash";
dotenv.config();

interface Config {
  app: {
    port: number | undefined;
    sessionSecret: string | undefined;
    apiVersion: number | undefined;
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
}
const DEV_CONFIG: Config = {
  app: {
    port: _.chain(process.env).get("DEV_APP_PORT").toNumber().value(),
    sessionSecret: _.get(process.env, "DEV_APP_SESSTIONSECRET"),
    apiVersion: _.chain(process.env).get("DEV_API_VERSION").toNumber().value(),
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
};
const PRO_CONFIG: Config = {
  app: {
    port: _.chain(process.env).get("PRO_APP_PORT").toNumber().value(),
    sessionSecret: _.get(process.env, "PRO_APP_SESSTIONSECRET"),
    apiVersion: _.chain(process.env).get("PRO_API_VERSION").toNumber().value(),
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
};
const envName: string = _.toUpper(_.get(process.env, "NODE_ENV", "DEV"));
export default {
  DEV: DEV_CONFIG,
  PRO: PRO_CONFIG,
}[envName];