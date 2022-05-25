import dotenv from 'dotenv';
import { Environment } from '../types';

export const getEnvironment = () => {
    const env = process.env.NODE_ENV || Environment.Development;
    const { error } = dotenv.config({ path: `.env.${env}` });
    
    if (error) {
        throw error;
    }

    return env;
}

export const exists = (x?: any) => {
    return x !== undefined;
}

export const zip = (a: any[], b: any[]) => {
    return a.map((value, i) => [value, b[i]]);
}

export const extractFields = (fields: string[], values: { [key: string]: any }) => {
    const existingFields = Object.keys(values);
    const filteredFields = fields.filter(field => existingFields.includes(field));

    return filteredFields.reduce((filteredValues, field) => {
        return {
            ...filteredValues,
            [field]: values[field],
        };

    }, {});
}

export const arrayEquals = <T> (a: T[], b: T[]) => {
    return a.length === b.length && a.every((value, i) => value === b[i]);
}

export const deepCopy = (o: object) => JSON.parse(JSON.stringify(o));

export const printJSON = (json: object) => {
    console.log(JSON.stringify(json, null, 2));
}