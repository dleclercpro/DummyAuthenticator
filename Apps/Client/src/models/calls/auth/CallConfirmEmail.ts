import CallPUT from '../base/CallPUT';

export class CallConfirmEmail extends CallPUT<void, void> {

    constructor(token: string) {
        super(`/confirm-email?token=${token}`);
    }
}