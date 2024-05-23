type EmailArgs = {
    value: string,
    confirmed?: boolean,
}



class UserEmail {
    private value: string;
    private confirmed: boolean;

    public constructor(args: EmailArgs) {
        this.value = args.value;
        this.confirmed = args.confirmed ?? false;
    }

    public serialize() {
        return JSON.stringify({
            value: this.value,
            confirmed: this.confirmed,
        });
    }

    public static deserialize(str: string) {
        return new UserEmail(JSON.parse(str));
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: string) {
        this.value = value;
    }

    public confirm() {
        this.confirmed = true;
    }

    public unconfirm() {
        this.confirmed = false;
    }

    public isConfirmed() {
        return this.confirmed;
    }
}

export default UserEmail;