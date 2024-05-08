type SecretReset = {
    count: number
    last: Date | null,
}

type SecretArgs = {
    value: string,
    reset?: SecretReset,
}



class UserSecret {
    private value: string;
    private reset: SecretReset;

    public constructor(args: SecretArgs) {
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
        return new UserSecret(JSON.parse(str));
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

export default UserSecret;