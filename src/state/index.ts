import { BittrexV3 } from "../models/bittrex";

export interface IAPIExchangeState {
    markets: { [key: string]: BittrexV3.Market }
    marketSummaries: { [key: string]: BittrexV3.MarketSummary }
    tickers: { [key: string]: BittrexV3.Ticker }
}

export const APIExchangeState = <IAPIExchangeState>{
    markets: {},
    marketSummaries: {},
    tickers: {}
}