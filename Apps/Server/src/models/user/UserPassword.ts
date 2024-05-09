import { DatedCounter } from '../../types';

type PasswordArgs = {
    value: string,
    request?: DatedCounter,
    reset?: DatedCounter,
}



class UserPassword {
    private value: string;
    private request: DatedCounter; // How many requests?
    private reset: DatedCounter; // How many successful resets?

    public constructor(args: PasswordArgs) {
        this.value = args.value;
        this.request = args.request ?? { count: 0, last: null };
        this.reset = args.reset ?? { count: 0, last: null };
    }

    public serialize() {
        return JSON.stringify({
            value: this.value,
            request: this.request,
            reset: this.reset,
        });
    }

    public static deserialize(str: string) {
        const args = JSON.parse(str);

        return new UserPassword({
            ...args,
            request: {
                ...args.request,
                last: new Date(args.request.last),
            },
            reset: {
                ...args.reset,
                last: new Date(args.reset.last),
            },
        });
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: string) {
        this.value = value;
    }

    public getRequestCount() {
        return this.request.count;
    }

    public incrementRequestCount() {
        this.request.count += 1;
    }

    public getLastRequest() {
        return this.request.last;
    }

    public setLastRequest(timestamp: Date) {
        this.request.last = timestamp;
    }

    public getResetCount() {
        return this.reset.count;
    }

    public incrementResetCount() {
        this.reset.count += 1;
    }

    public getLastReset() {
        return this.reset.last;
    }

    public setLastReset(timestamp: Date) {
        this.reset.last = timestamp;
    }

    public wasAlreadyReset() {
        return this.reset.count > 0;
    }
}

export default UserPassword;