import User from '../../models/User';
import Command from '../Command';
import { ErrorUserAlreadyExists } from '../../errors/UserErrors';

interface Argument {
    email: string,
    password: string,
}

type Response = User;

class CreateUserCommand extends Command<Argument, Response> {

    public constructor(argument: Argument) {
        super('CreateUserCommand', argument);
    }

    protected async doExecute() {
        const { email, password } = this.argument;

        // Try and find user in database
        const user = await User.findByEmail(email);

        // User should not already exist in database
        if (user) {
            throw new ErrorUserAlreadyExists(user);
        }
        
        // Create new user instance
        return User.create(email, password);
    }
}

export default CreateUserCommand;