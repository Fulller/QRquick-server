// Import Packages
import express, {
  ErrorRequestHandler,
  Response,
  Request,
  NextFunction,
} from "express";
import morgan from "morgan";
import compression from "compression";
import database from "./database/init.mongodb";
import router from "./routers";
import { response, notFound, handleError } from "./middlewares";
import _ from "lodash";
import configs from "./configs";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./auth/passport.auth";
// Init app

const app = express();

// Use middlewares
app.use(cors({ origin: _.get(configs, "auth.clientUrl"), credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(compression());

// Connect database
database;
// countConnect();
// checkOverload();

//Auth with passport
app.use(
  session({
    secret: _.get(configs, "app.sessionSecret", "secret"),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Use router
app.use(response);
app.use(router);
app.use(notFound);
app.use(handleError);

//Running server
const PORT: number = _.get(configs, "app.port", 3000);

const server = app.listen(PORT, () => {
  console.log("Server running on PORT :: ", PORT);
});

process.on("SIGINT", (): void => {
  server.close((): void => {
    console.log("Server stoped");
  });
});
