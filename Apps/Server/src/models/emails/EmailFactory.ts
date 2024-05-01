import User from '../auth/User';
import TokenManager from '../auth/TokenManager';
import ResetPasswordEmail from './ResetPasswordEmail';
import EmailAddressConfirmationEmail from './EmailAddressConfirmationEmail';



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