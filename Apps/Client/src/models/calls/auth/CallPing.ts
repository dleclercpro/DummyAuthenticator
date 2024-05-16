import CallGET from '../base/CallGET';

export interface Data {

}

export type ResponseData = {
    email: string,
    isAdmin: boolean,
};

export interface ErrorResponseData {

}

export default class CallPing extends CallGET<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/ping`);
    }
}