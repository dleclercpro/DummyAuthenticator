import User from '../../models/User';
import Command from '../Command';
import { ErrorUserAlreadyExists } from '../../errors/UserErrors';
import { logger } from '../../utils/Logging';

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
        let user = await User.findByEmail(email);

        // User should not already exist in database
        if (user) {
            throw new ErrorUserAlreadyExists(user);
        }
        
        // Create new user instance
        user = await User.create(email, password);

        // Report its creation
        logger.info(`New user created: ${user.getEmail()}`);

        return user;
    }
}

export default CreateUserCommand;