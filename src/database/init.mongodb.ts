import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect";
import config from "../configs";
import _ from "lodash";

const CONNECT_URL: string = _.get(
  config,
  "db.url",
  "mongodb://localhost:27017/base"
);
// Singleton pattern
class Database {
  private static instance: Database;
  public connectURL: string;
  public value: number;

  private constructor() {
    this.connectURL = CONNECT_URL;
    this.value = Math.random();
    this.connect();
  }

  private connect(): void {
    mongoose
      .connect(this.connectURL)
      .then(() => {
        console.log("Connected to MongoDB successfully", countConnect());
      })
      .catch(() => {
        console.log("Connection to MongoDB failed");
      });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb: Database = Database.getInstance();

export default instanceMongodb;
