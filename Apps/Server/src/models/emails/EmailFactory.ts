import User from '../user/User';
import TokenManager from '../auth/TokenManager';
import ResetPasswordEmail from './ResetPasswordEmail';
import EmailAddressConfirmationEmail from './EmailAddressConfirmationEmail';
import Person from '../people/Person';



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

  public async createConfirmationEmail(user: User) {
    const token = await TokenManager.generateEmailConfirmationToken(user);

    return new EmailAddressConfirmationEmail(user.getEmail().getValue(), token);
  }

  public async createResetPasswordEmail(user: User) {
    const token = await TokenManager.generateResetPasswordToken(user);

    return new ResetPasswordEmail(user.getEmail().getValue(), token);
  }
}

export default EmailFactory.getInstance();