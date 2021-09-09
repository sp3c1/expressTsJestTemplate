import { Axios, AxiosRequestConfig } from "axios";
import { DI } from "../di";

const axios = require('axios').default;

export class AxiosWrapperLibrary {
    constructor(public di: DI, public _handler: Axios = axios) {
    }

    async get(url: string, options?: AxiosRequestConfig<any>): Promise<any> {
        return this._handler.get(url, options);
    }
}