type Args = {
    street?: string,
    city: string,
    country: string,
}

class Address {
    protected street?: string;
    protected city: string;
    protected country: string;

    public constructor(args: Args) {
        this.street = args.street;
        this.city = args.city;
        this.country = args.country;
    }

    public serialize() {
        return JSON.stringify({
            street: this.street,
            city: this.city,
            country: this.country,
        });
    }

    public static deserialize(str: string) {
        return new Address(JSON.parse(str));
    }

    public getStreet() {
        return this.street;
    }

    public getCity() {
        return this.city;
    }

    public getCountry() {
        return this.country;
    }
}

export default Address;