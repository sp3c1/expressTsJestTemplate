import { Server } from 'http';
import { bootstrap } from '../bootstrap';
import { Config } from '../config';
import { DI } from '../di';

const config = Config(`./.env.test`);

const mockLogger = {
    warn: () => { },
    info: () => { },
    error: () => { },
};

const mockLoggerHandler = (req: any, res: any, next?: any) => { next?.() };

const di = new DI(config, <any>mockLogger);

let server: Server | null = null;

beforeAll(async () => {
    server = await bootstrap(di, mockLoggerHandler);
});

afterAll((done) => {
    server?.close(() => {
        done();
    })
});
