import User from '../auth/User';
import TokenManager from '../auth/TokenManager';
import PasswordRecoveryEmail from './PasswordRecoveryEmail';
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
    const token = await TokenManager.generateForgotPasswordToken(user);

    return new EmailAddressConfirmationEmail(user.getEmail().getValue(), token);
  }

  public async createPasswordRecoveryEmail(user: User) {
    const token = await TokenManager.generateForgotPasswordToken(user);

    return new PasswordRecoveryEmail(user.getEmail().getValue(), token);
  }
}

export default EmailFactory.getInstance();