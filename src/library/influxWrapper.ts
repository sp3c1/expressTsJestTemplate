
import { DI } from "../di";
import { InfluxDB, Point, QueryApi, WriteApi } from '@influxdata/influxdb-client';

export class InfluxWrapperLibrary {
    public _influx: InfluxDB;
    public _writeApi: WriteApi;
    public _queryApi: QueryApi;

    constructor(public di: DI) {
        this._influx = new InfluxDB({
            url: di.config.influx.url,
            token: di.config.influx.token
        });

        this._writeApi = this._influx.getWriteApi(di.config.influx.org, di.config.influx.bucket);
        this._queryApi = this._influx.getQueryApi(di.config.influx.org);
    }

    writePoint(point: Point): void {
        this._writeApi.writePoint(point);
    }


}