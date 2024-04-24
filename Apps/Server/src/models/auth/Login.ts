import { getLast } from '../../utils/array';

export enum LoginAttemptType {
    Success = 'success',
    Failure = 'failure',
}

type LoginAttempt = {
    type: LoginAttemptType,
    timestamp: Date,
}

type LoginArgs = {
    attempts?: LoginAttempt[],
}



class Login {
    private attempts: LoginAttempt[];

    public constructor(args: LoginArgs) {
        this.attempts = args.attempts ?? [];
    }

    public serialize() {
        return JSON.stringify({
            attempts: this.attempts,
        });
    }

    public static deserialize(str: string) {
        return new Login(JSON.parse(str));
    }

    public getAttempts() {
        return this.attempts;
    }

    public getFirstAttempt() {
        return this.attempts[0];
    }

    public getLastAttempt() {
        return getLast(this.attempts);
    }

    public addAttempt(type: LoginAttemptType) {
        this.attempts.push({
            type,
            timestamp: new Date(),
        });
    }
}

export default Login;