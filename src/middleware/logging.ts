import { NextFunction, Request, Response } from "express";
import { Logger } from "pino";
import { format } from "util";
import { v4 } from 'uuid';

export function registerLoggerMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
        req.id = v4();
        next();
    };
}

export function initLogger(): {
    logger: Logger;
    loggerHandler: (req: Request, res: Response) => void;
} {
    const fastRedact = require(`fast-redact`);

    const redact = fastRedact({
        paths: [`password`],
        censor: `**redacted**`
    });


    const pino = require('pino');
    pino.redact = redact;

    const logger: Logger = pino();

    const loggerHandler = <(req: Request, res: Response) => void>require(`pino-http`)({

        logger,

        serializers: {
            err: pino.stdSerializers.err,
            req: pino.stdSerializers.req,
            res: pino.stdSerializers.res
        },

        wrapSerializers: true,

        customLogLevel: function (res: Response, err: Error) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'error'
            } else if (res.statusCode >= 500 || err) {
                return 'error'
            }
            return 'info'
        },

        // Define a custom success message
        customSuccessMessage: function (res: Response) {
            if (res.statusCode === 404) {
                return 'resource not found'
            }
            // return 'request completed'
            if (typeof res.locals.data === "object") {
                return `Response: ${format("%O", redact(res.locals.data))}`;
            } else {
                return `Response: ${res.locals.data}`;
            }

        },

        // Define a custom error message
        customErrorMessage: function (error: Error, res: Response) {
            return `request errored with status code: ` + res.statusCode
        },

        // Override attribute keys for the log object
        customAttributeKeys: {
            req: 'request',
            res: 'response',
            err: 'error',
            responseTime: 'timeTaken'
        },

        // Define additional custom request properties
        customProps: function (req: Request, res: Response) {
            return {
                // customResponse: req.data,
                // customResponseId: req.id,
                // user request-scoped data is in res.locals for express applications
                // locals: res.locals.data
            }
        }

    });

    return { logger, loggerHandler };
}