import CallGET from '../base/CallGET';

export class CallPing extends CallGET<void> {

    constructor() {
        super(`/ping`);
    }
}