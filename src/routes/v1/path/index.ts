import { Router } from "express";
import { DI } from "../../../di";

module.exports = function registerRouter(di: DI) {
    const router = Router();

    // router.get(`/`, mainController(di));

    return router;
}