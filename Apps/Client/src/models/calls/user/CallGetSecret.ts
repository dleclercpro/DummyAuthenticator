import CallGET from '../base/CallGET';

type Response = string;

export class CallGetSecret extends CallGET<void, Response> {

    constructor() {
        super(`/secret`);
    }
}