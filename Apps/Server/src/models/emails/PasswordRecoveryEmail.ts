import { CLIENT_ROOT } from '../../config/AppConfig';
import Email from './Email';



class PasswordRecoveryEmail extends Email {

  public constructor(to: string, token: string) {
    const link = `${CLIENT_ROOT}/reset-password?token=${token}`;
    const from = 'no-reply@yourdomain.com';
    const subject = 'Password Recovery';
    const content = `<p>
      You requested a password reset. Please follow this <a href="${link}">link</a> to set a new password. If you did not request this, please ignore this email.
    </p>`;
    
    super({ from, to, subject, content });
  }
}

export default PasswordRecoveryEmail;