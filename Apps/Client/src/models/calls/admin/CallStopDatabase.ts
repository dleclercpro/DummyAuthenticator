import CallPUT from '../base/CallPUT';

export interface Data {

}

export type ResponseData = {

};

export interface ErrorResponseData {

}

export default class CallStopDatabase extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/database/stop`);
    }
}