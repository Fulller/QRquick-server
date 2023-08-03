import { responseDto } from "./responseDto";
import { Response } from "express";

declare global {
  namespace Express {
    interface Response {
      fly(data: responseDto): void;
    }
  }
}
