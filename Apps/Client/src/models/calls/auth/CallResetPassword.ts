import CallPOST from '../base/CallPOST';

interface Data {
    password: string,
}

export class CallResetPassword extends CallPOST<Data, void> {

    constructor(token?: string) {
        const url = `/reset-password`;
        super(token ? `${url}?token=${token}` : url);
    }
}