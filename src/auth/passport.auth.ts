import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import configs from "../configs";
import _ from "lodash";

const google = _.get(configs, "auth.google");
const clientUrl: string = _.get(
  configs,
  "auth.clientUrl",
  "http://localhost:3000"
);

passport.serializeUser((user, done) => {
  // You can customize the user serialization logic
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  // You can customize the user deserialization logic
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: _.get(google, "clientID", ""),
      clientSecret: _.get(google, "clientSecret", ""),
      callbackURL: clientUrl,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
