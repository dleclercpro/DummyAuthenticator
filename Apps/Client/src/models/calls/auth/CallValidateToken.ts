import CallPUT from '../base/CallPUT';

interface Data {
    token: string,
}

interface Response {
    string: string,
    content: object,
}

export class CallValidateToken extends CallPUT<Data, Response> {

    constructor() {
        super(`/token`);
    }
}