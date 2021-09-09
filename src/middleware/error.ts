import { NextFunction, Request, Response } from "express";

export function errorMiddleware() {
    return (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return res.end();
        }

        res.status(500);

        return res.json({ message: error.message });
    }
}