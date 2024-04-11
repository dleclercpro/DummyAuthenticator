import { CLIENT_ROOT } from '../../config/AppConfig';
import { GMAIL_USER } from '../../config/AuthConfig';
import { TimeUnit } from '../../types/TimeTypes';
import { PasswordRecoveryToken } from '../../types/TokenTypes';
import TimeDuration from '../units/TimeDuration';
import Email from './Email';

class PasswordRecoveryEmail extends Email {

  public constructor(to: string, token: { string: string, content: PasswordRecoveryToken }) {
    const link = `${CLIENT_ROOT}/reset-password?token=${token.string}`;

    const from = `Dummy Authenticator <${GMAIL_USER}>`;
    const subject = 'Reset your password';

    super({ from, to, subject, html: `
      <h1>Reset password</h1>
      <p>
        Hello,
      </p>
      <p>
        You have requested to reset your password. To do so, please click on the following link:
      </p>
      <a href='${link}'>
        ${link}
      </a>
      <p>
        The link will remain valid for: ${new TimeDuration(token.content.validTime, TimeUnit.Millisecond).format()}
      </p>
      <p>
        Cheers!
      </p>
      <p>
        David Leclerc<br />
        Senior Software Engineer<br />
        Berlin, GERMANY<br />
        d.leclerc.pro@gmail.com
      </p>
    `,});
  }
}

export default PasswordRecoveryEmail;