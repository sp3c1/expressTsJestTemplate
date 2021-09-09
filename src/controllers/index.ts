import { NextFunction, Request, Response } from "express";
import { DI } from "../di";

const pkgJson = require(`../../package.json`);

export function mainController(di: DI) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.locals.data = { name: pkgJson.name, version: pkgJson.version }
        res.locals.status = 200;
        return next();
    };
}