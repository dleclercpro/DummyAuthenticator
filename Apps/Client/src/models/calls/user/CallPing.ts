import CallGET from '../base/CallGET';

export interface Data {

}

export type ResponseData = {
    isAdmin: boolean,
};

export interface ErrorResponseData {

}

export default class CallPing extends CallGET<void, ResponseData> {

    constructor() {
        super(`/ping`);
    }
}