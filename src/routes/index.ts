import { Application, NextFunction, Request, Response, Router } from "express";
import { DI } from "../di";
import * as glob from 'glob';
import { mainController } from "../controllers";


export function registerRouter(di: DI, app: Application) {
    const indexRouter = Router();

    const paths = getDirectories(`./src/routes`);

    di.logger.info(`Paths to register routes ${paths.join(", ")}`,);

    indexRouter.get(`/`, mainController(di));

    for (const path of paths) {
        try {
            app.use(path, require(`./${path}`)(di));
            di.logger.info(`Registered router under ${path}`);
        } catch (error) {
            // di.logger.error(error, `Did not registere path ${path}`);
            di.logger.warn(`Did not registere path ${path}`);
        }
    }

    app.use(indexRouter)
}


function getDirectories(src: string) {
    return glob.sync(src + '/**/*/').map(item => item.replace(src, ".").slice(1, -1));
}