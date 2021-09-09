import { Point } from '@influxdata/influxdb-client';
import { stat } from 'fs';
import { v4 } from 'uuid';
import { DI } from "../di";
import { BittrexV3 } from "../models/bittrex";

export class FetcherLibrary {
    private registeredIntervals: { [key: string]: NodeJS.Timer } = {};

    constructor(public di: DI, private timeOut = 5000) {

    }

    registerIntervals() {
        const config = this.di.config;
        const state = this.di.state;

        this.registeredIntervals[v4()] = setInterval(async () => {
            const response = await this.di.axiosWrapperLibrary.get(`https://api.bittrex.com/v3/markets`);

            for (const market of <BittrexV3.Market[]>response.data) {
                if (config.markets.includes(market.symbol)) {
                    market.internalUpdatedAt = new Date();
                    state.markets[String(market.symbol)] = market;
                }
            }
        }, this.timeOut);

        this.registeredIntervals[v4()] = setInterval(async () => {
            const response = await this.di.axiosWrapperLibrary.get(`https://api.bittrex.com/v3/markets/summaries`);
            for (const marketSummary of <BittrexV3.MarketSummary[]>response.data) {
                try {
                    if (config.markets.includes(marketSummary.symbol)) {
                        marketSummary.internalUpdatedAt = new Date();
                        state.marketSummaries[String(marketSummary.symbol)] = marketSummary;
                        // write to db
                        const point = new Point(`MARKET_${marketSummary.symbol}`).floatField(`high`, marketSummary.high).floatField(`low`, marketSummary.low);
                        this.di.influxWrapperLibrary.writePoint(point);
                        // this.di.logger.info(point, `added point summary`);
                    }
                } catch (error) {
                    this.di.logger.warn(error);
                }
            }
        }, this.timeOut);

        this.registeredIntervals[v4()] = setInterval(async () => {
            const response = await this.di.axiosWrapperLibrary.get(`https://api.bittrex.com/v3/markets/tickers`);
            for (const ticker of <BittrexV3.Ticker[]>response.data) {
                try {
                    if (config.markets.includes(ticker.symbol)) {
                        ticker.internalUpdatedAt = new Date();
                        state.tickers[String(ticker.symbol)] = ticker;
                        // write to db
                        const point = new Point(`MARKET_${ticker.symbol}`)
                            .floatField(`lastTradeRate`, ticker.lastTradeRate)
                            .floatField(`bidRate`, ticker.bidRate)
                            .floatField(`askRate`, ticker.askRate);

                        this.di.influxWrapperLibrary.writePoint(point);
                        // this.di.logger.info(point, `added point tick`);
                    }
                } catch (err) {
                    this.di.logger.warn(err);
                }

            }
        }, this.timeOut);

    }

    deregisterIntervals() {
        for (const key in this.registeredIntervals) {
            clearInterval(this.registeredIntervals[String(key)]);
        }
    }
}