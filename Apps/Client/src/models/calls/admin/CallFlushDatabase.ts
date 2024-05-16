import CallDELETE from '../base/CallDELETE';

export interface Data {

}

export type ResponseData = {

};

export interface ErrorResponseData {

}

export default class CallFlushDatabase extends CallDELETE<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/database`);
    }
}