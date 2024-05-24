import { UserType } from '../../constants';

class UserComparators {
    private static instance: UserComparators;

    private constructor() {

    }

    public static getInstance() {
        if (!UserComparators.instance) {
            UserComparators.instance = new UserComparators();
        }
        return UserComparators.instance;
    }

    private getTypeOrder(value: UserType) {
        switch (value) {
            case UserType.SuperAdmin:
                return 2;
            case UserType.Admin:
                return 1;
            case UserType.Regular:
                return 0;
        }
    }

    public compareType(a: UserType, b: UserType, reversed: boolean = false) {
        if (this.getTypeOrder(a) > this.getTypeOrder(b)) return reversed ? -1 : 1;
        if (this.getTypeOrder(a) < this.getTypeOrder(b)) return reversed ? 1 : -1;
        return 0;
    }

    public compareEmail(a: string, b: string, reversed: boolean = false) {
        if (a > b) return reversed ? -1 : 1;
        if (a < b) return reversed ? 1 : -1;
        return 0;
    }
}

export default UserComparators.getInstance();