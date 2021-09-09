export interface IConfig {
    server: {
        port: number | string,
        name: string
    }
    enviroment: string,
    markets: string[],
    influx: {
        org: string,
        bucket: string,
        url: string,
        token: string
    }
}

export function Config(path?: string): IConfig {
    require(`dotenv`).config({ path });

    return <IConfig>{
        server: {
            port: process.env['SERVER_PORT'] ?? 3003,
            name: process.env[`SERVER_NAME`] ?? `Lesson1`
        },
        enviroment: process.env[`ENVIROMENT`] ?? `dev`,
        markets: process.env?.[`MARKETS`]?.split(",") ?? [],
        influx: {
            org: process.env[`INFLUX_ORG`] ?? `influx-org`,
            bucket: process.env[`INFLUX_BUCKET`] ?? `default-bucket`,
            url: process.env[`INFLUX_URL`] ?? `influx-url`,
            token: process.env[`INFLUX_TOKEN`] ?? `influx-token`
        }
    };
}