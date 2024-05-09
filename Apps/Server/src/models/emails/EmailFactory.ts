import User from '../user/User';
import ResetPasswordEmail from './ResetPasswordEmail';
import EmailAddressConfirmationEmail from './EmailAddressConfirmationEmail';
import Person from '../people/Person';
import { ConfirmEmailToken, ResetPasswordToken } from '../../types/TokenTypes';



// Singleton
class EmailFactory {
  private static instance?: EmailFactory;

  private constructor() {

  }

  public static getInstance() {
    if (!EmailFactory.instance) {
      EmailFactory.instance = new EmailFactory();
    }
    return EmailFactory.instance;
  }

  public createHTMLSignature(person: Person) {
    return `
      ${person.getFirstName()} ${person.getLastName()}<br />
      ${person.getOccupation() ? `${person.getOccupation()}<br />` : ''}
      ${person.getAddress().getCity()}, ${person.getAddress().getCountry().toUpperCase()}<br />
      ${person.getPhone()}<br />
      ${person.getEmail()}
    `;
  }

  public async createConfirmationEmail(user: User, token: { string: string, content: ConfirmEmailToken }) {
    return new EmailAddressConfirmationEmail(user.getEmail().getValue(), token);
  }

  public async createResetPasswordEmail(user: User, token: { string: string, content: ResetPasswordToken }) {
    return new ResetPasswordEmail(user.getEmail().getValue(), token);
  }
}

export default EmailFactory.getInstance();