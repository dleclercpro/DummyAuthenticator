import { UserType } from '../../constants';

class UserTypeComparator {
    public static getOrder(value: UserType) {
        switch (value) {
            case UserType.SuperAdmin:
                return 2;
            case UserType.Admin:
                return 1;
            case UserType.Regular:
                return 0;
        }
    }

    public static compare(a: UserType, b: UserType) {
        if (UserTypeComparator.getOrder(a) > UserTypeComparator.getOrder(b)) return 1;
        if (UserTypeComparator.getOrder(a) < UserTypeComparator.getOrder(b)) return -1;
        return 0;
    }
}

export default UserTypeComparator;