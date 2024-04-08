import CallGET from '../base/CallGET';

interface Data {
    renew: boolean,
}

type Response = string;

export class CallGetSecret extends CallGET<Data, Response> {

    constructor() {
        super(`/secret`);
    }
}