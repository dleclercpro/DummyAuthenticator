import { ErrorUserDoesNotExist } from '../../errors/UserErrors';
import User from '../../models/User';
import Command from '../Command';

interface Argument {
    email: string,
}

class DeleteUserCommand extends Command<Argument> {

    public constructor(argument: Argument) {
        super('DeleteUserCommand', argument);
    }

    protected async doExecute() {
        const { email } = this.argument;

        // Try and find user in database
        const user = await User.findByEmail(email);

        // User should exist in database
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }
        
        // Remove user from database
        user.delete();
    }
}

export default DeleteUserCommand;