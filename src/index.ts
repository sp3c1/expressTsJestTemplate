import { bootstrap } from "./bootstrap";
import { Config } from "./config";
import { DI } from "./di";
import { initLogger } from "./middleware/logging";

const config = Config();
const { logger, loggerHandler } = initLogger();
const di = new DI(config, logger);

bootstrap(di, loggerHandler).then((server) => {
    logger.info(`Bootstraped Server`);
}).catch((err) => {
    logger.error(err);
});