import './RequestTypes'; // Do not remove!

export enum Environment {
    Development = 'development',
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