import { CLIENT_ROOT } from '../../config/AppConfig';
import { GMAIL_USER } from '../../config/AuthConfig';
import Email from './Email';



class PasswordRecoveryEmail extends Email {

  public constructor(to: string, token: string) {
    const link = `${CLIENT_ROOT}/reset-password?token=${token}`;

    const from = `Dummy Authenticator <${GMAIL_USER}>`;
    const subject = 'Reset your password';

    const content = `
      <h1>Reset password</h1>
      <p>
        Hello,<br />
        You have requested a link to reset your password.<br />
        To reset your password, please click on the following link:
      </p>
      <a href='${link}'>
        ${link}
      </a>
      <p>
        Cheers!
      </p>
      <p>
        David Leclerc<br />
        Senior Software Engineer<br />
        Berlin, GERMANY<br />
        d.leclerc.pro@gmail.com
      </p>
    `;
    
    super({ from, to, subject, html: content });
  }
}

export default PasswordRecoveryEmail;