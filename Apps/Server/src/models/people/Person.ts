import Address from './Address';

interface PersonArgs {
    firstName: string,
    lastName: string,
    address: Address,
    email: string,
    phone?: string,
    occupation?: string,
}



class Person {
    protected firstName: string;
    protected lastName: string;
    protected address: Address;
    protected email: string;
    protected phone?: string;
    protected occupation?: string;

    public constructor(args: PersonArgs) {
        this.firstName = args.firstName;
        this.lastName = args.lastName;
        this.address = args.address;
        this.email = args.email;
        this.phone = args.phone;
        this.occupation = args.occupation;
    }

    public serialize() {
        return JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            address: this.address.serialize(),
            email: this.email,
            phone: this.phone,
            occupation: this.occupation,
        });
    }

    public static deserialize(str: string) {
        const args = JSON.parse(str);

        const person = new Person({
            ...args,
            address: Address.deserialize(args.address),
        });

        return person;
    }

    public getFirstName() {
        return this.firstName;
    }

    public getLastName() {
        return this.lastName;
    }

    public getAddress() {
        return this.address;
    }

    public getEmail() {
        return this.email;
    }

    public getPhone() {
        return this.phone;
    }

    public getOccupation() {
        return this.occupation;
    }
}

export default Person;