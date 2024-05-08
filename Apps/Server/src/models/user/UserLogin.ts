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



class UserLogin {
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
        const args = JSON.parse(str);

        // Ensure timestamp is a Date object
        const attempts = args.attempts
            .map(({ type, timestamp }: { type: string, timestamp: string }) => {
                return {
                    type: type as LoginAttemptType,
                    timestamp: new Date(timestamp),
                };
            });

        return new UserLogin({ attempts });
    }

    public getAttempts() {
        return this.attempts;
    }

    public setAttempts(attempts: LoginAttempt[]) {
        this.attempts = attempts;
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

export default UserLogin;