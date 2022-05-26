import './RequestTypes'; // Do not remove!

export enum Environment {
    Development = 'development',
    Production = 'production',
}

export interface Session {
    email: string,
    expireAt: Date,
}