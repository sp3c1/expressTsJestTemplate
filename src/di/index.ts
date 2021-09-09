import { Logger } from "pino";
import { IConfig } from "../config";
import { AxiosWrapperLibrary } from "../library/axiosWrapper";
import { FetcherLibrary } from "../library/fetcher";
import { InfluxWrapperLibrary } from "../library/influxWrapper";
import { IAPIExchangeState, APIExchangeState } from "../state";

export class DI {
    private _fetcherLibrary!: FetcherLibrary;
    private _axiosWrapperLibrary!: AxiosWrapperLibrary;
    private _influxWrapperLibrary!: InfluxWrapperLibrary;

    public state: IAPIExchangeState = APIExchangeState;

    constructor(public config: IConfig, public logger: Logger) {
    }

    public async init() {
    }

    public registerAsyncHooks() {
        this.fetcherLibrary.registerIntervals();
    }

    // ============================================
    get fetcherLibrary(): FetcherLibrary {
        return this._fetcherLibrary ? this._fetcherLibrary : this._fetcherLibrary = new FetcherLibrary(this);
    }

    get axiosWrapperLibrary(): AxiosWrapperLibrary {
        return this._axiosWrapperLibrary ? this._axiosWrapperLibrary : this._axiosWrapperLibrary = new AxiosWrapperLibrary(this);
    }

    get influxWrapperLibrary(): InfluxWrapperLibrary {
        return this._influxWrapperLibrary ? this._influxWrapperLibrary : this._influxWrapperLibrary = new InfluxWrapperLibrary(this);
    }

    set fetcherLibrary(v: FetcherLibrary) {
        this._fetcherLibrary = v;
    }

    set axiosWrapperLibrary(v: AxiosWrapperLibrary) {
        this._axiosWrapperLibrary = v;
    }

    set influxWrapperLibrary(v: InfluxWrapperLibrary) {
        this._influxWrapperLibrary = v;
    }
}