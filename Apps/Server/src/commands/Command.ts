abstract class Command<Argument = void, Response = void> {
    protected name: string;
    protected argument: Argument;

    protected abstract doExecute(): Promise<Response>;    

    public constructor(name: string, argument: Argument) {
        this.name = name;
        this.argument = argument;
    }

    public async execute() {
        try {
            return await this.doExecute();

        } catch (err: any) {
            throw this.handleError(err);
        }
    }

    protected handleError(err: any) {
        return err;
    }
}

export default Command;