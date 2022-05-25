import CallGET from '../CallGET';

export class CallSignOut extends CallGET<void> {

    constructor() {
        super(`sign-out`);
    }
}