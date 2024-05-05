import CallGET from '../base/CallGET';

export default class CallSignOut extends CallGET<void> {

    constructor() {
        super(`/sign-out`);
    }
}