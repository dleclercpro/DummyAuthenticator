import CallPUT from '../base/CallPUT';

interface Data {
    token: string,
}

interface Response {
    token: string,
    content: any,
}

export class CallValidateToken extends CallPUT<Data, Response> {

    constructor() {
        super(`/token`);
    }
}