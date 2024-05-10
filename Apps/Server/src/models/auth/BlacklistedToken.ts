import { APP_DB } from '../..';
import { TokenType } from '../../constants';
import { TokenContent } from '../../types/TokenTypes';

interface Args {
    id: string,
    value: string,
    content: TokenContent,
    version?: number,
}



class BlacklistedToken {
    private id: string;
    private value: string;
    private content: TokenContent;
    private version: number;

    public constructor(args: Args) {
        this.id = args.id;
        this.value = args.value;
        this.content = args.content;
        this.version = args.version ?? 0;
    }

    public serialize() {
        return JSON.stringify({
            id: this.id,
            version: this.version,
        });
    }

    public static deserialize(str: string) {
        const args = JSON.parse(str);

        const user = new BlacklistedToken({
            ...args,
        });

        return user;
    }

    public getId() {
        return this.id;
    }

    public getType() {
        return this.content.type;
    }

    public getValue() {
        return this.value;
    }

    public getContent() {
        return this.content;
    }

    public getVersion() {
        return this.version;
    }

    public async save() {
        await APP_DB.set(`token:${this.getId()}`, this.serialize());
    }

    public async delete() {
        await APP_DB.delete(`token:${this.getId()}`);
    }

    // STATIC METHODS
    public static async findById(id: string) {
        const tokenAsString = await APP_DB.get(`token:${id}`);

        if (tokenAsString) {
            return BlacklistedToken.deserialize(tokenAsString);
        }
    }

    public static async create(id: string, type: TokenType, value: string, content: TokenContent) {
        const token = new BlacklistedToken({
            id,
            value,
            content,
        });
    
        // Store token in database
        await token.save();

        return token;
    }
}

export default BlacklistedToken;