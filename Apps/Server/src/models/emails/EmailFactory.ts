import User from '../auth/User';
import TokenManager from '../auth/TokenManager';
import PasswordRecoveryEmail from './PasswordRecoveryEmail';



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

  public async createPasswordRecoveryEmail(user: User) {
    const token = await TokenManager.generateForgotPasswordToken(user);

    return new PasswordRecoveryEmail(user.getEmail(), token);
  }
}

export default EmailFactory.getInstance();