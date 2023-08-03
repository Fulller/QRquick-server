import { Request, Response, NextFunction } from "express";

export default function (fn: any): any {
  return function (req: Request, res: any, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}
