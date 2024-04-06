import CallGET from '../base/CallGET';

export class CallSignOut extends CallGET<void> {

    constructor() {
        super(`/sign-out`);
    }
}