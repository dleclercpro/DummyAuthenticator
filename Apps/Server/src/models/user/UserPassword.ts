type PasswordReset = {
    count: number
    last: Date | null,
}

type PasswordArgs = {
    value: string,
    reset?: PasswordReset,
}



class UserPassword {
    private value: string;
    private reset: PasswordReset;

    public constructor(args: PasswordArgs) {
        this.value = args.value;
        this.reset = args.reset ?? { count: 0, last: null };
    }

    public serialize() {
        return JSON.stringify({
            value: this.value,
            reset: this.reset,
        });
    }

    public static deserialize(str: string) {
        return new UserPassword(JSON.parse(str));
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: string) {
        this.value = value;
    }

    public getResetCount() {
        return this.reset.count;
    }

    public incrementResetCount() {
        this.reset.count += 1;
    }

    public wasAlreadyReset() {
        return this.reset.count > 0;
    }

    public getLastReset() {
        return this.reset.last;
    }

    public setLastReset(timestamp: Date) {
        this.reset.last = timestamp;
    }
}

export default UserPassword;