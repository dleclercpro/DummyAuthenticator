import './RequestTypes'; // Do not remove!

export enum Environment {
    Development = 'development',
    Test = 'test',
    Production = 'production',
}

export interface Auth {
    user: string,
    pass: string,
}

export interface Comparable {
    compare(other: Comparable): -1 | 0 | 1;
    smallerThan(other: Comparable): boolean;
    smallerThanOrEquals(other: Comparable): boolean;
    equals(other: Comparable): boolean;
    greaterThanOrEquals(other: Comparable): boolean;
    greaterThan(other: Comparable): boolean;
}

export type DatedCounter = {
    count: number
    last: Date | null,
}

export interface DatabaseOptions {
    host: string,
    port: number,
    name: string,
    auth?: Auth,
}

export interface IKeyValueDatabase<R> {
    has(id: string): Promise<boolean>;
    get(id: string): Promise<R | null>;
    set(id: string, record: R): Promise<void>;
    delete(id: string): Promise<void>;
    flush(): Promise<void>;
}