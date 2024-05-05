import CallPUT from '../base/CallPUT';

export default class CallConfirmEmail extends CallPUT<void, void> {

    constructor(token: string) {
        super(`/confirm-email?token=${token}`);
    }
}