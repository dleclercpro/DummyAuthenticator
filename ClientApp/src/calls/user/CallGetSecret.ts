import CallPUT from '../base/CallPUT';

interface Data {
    renew: boolean,
}

type Response = string;

export class CallGetSecret extends CallPUT<Data, Response> {

    constructor() {
        super(`secret`);
    }
}