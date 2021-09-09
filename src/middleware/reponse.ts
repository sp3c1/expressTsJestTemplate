import { NextFunction, Request, Response } from "express";


export function reponseMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals?.data && !res.locals?.status) {
            return res.status(404).json({ message: 'Not found' });
        }

        const status = res.locals.status ?? 200;
        res.status(status)
        if (typeof res.locals.data === "object") {
            res.json(res.locals.data)
        } else {
            res.send(res.locals.data);
        }
    };
} 