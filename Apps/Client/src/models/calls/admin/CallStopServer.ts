import CallDELETE from '../base/CallDELETE';

export interface Data {

}

export type ResponseData = {

};

export interface ErrorResponseData {

}

export default class CallStopServer extends CallDELETE<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/server`);
    }
}