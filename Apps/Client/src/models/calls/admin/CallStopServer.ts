import CallPUT from '../base/CallPUT';

export interface Data {

}

export type ResponseData = {

};

export interface ErrorResponseData {

}

export default class CallStopServer extends CallPUT<Data, ResponseData, ErrorResponseData> {

    constructor() {
        super(`/server/stop`);
    }
}