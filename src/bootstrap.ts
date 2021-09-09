import bodyParser from "body-parser";
import { Application } from "express";
import { Server } from "http";
import { DI } from "./di";
import { errorMiddleware } from "./middleware/error";
import { registerLoggerMiddleware } from "./middleware/logging";
import { reponseMiddleware } from "./middleware/reponse";
import { registerRouter } from "./routes";

export async function bootstrap(di: DI, loggerHandler: any): Promise<Server> {
    const express = require('express');
    const app: Application = express();

    await di.init();
    di.registerAsyncHooks();

    di.logger.info(`Registering top level middleware`);
    app.use(registerLoggerMiddleware());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    di.logger.info(`Registering logger`);
    app.use(loggerHandler);

    di.logger.info(`Registetring endpoints`);
    registerRouter(di, app);

    di.logger.info(`Registering response level middleware`);
    app.use(reponseMiddleware());
    app.use(errorMiddleware());

    di.logger.info(`Server [${di.config.server.name}] starts at port ${di.config.server.port}`);

    return app.listen(di.config.server.port);
}
