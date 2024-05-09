import { APP_AUTHOR, CLIENT_ROOT } from '../../config/AppConfig';
import { GMAIL_USER } from '../../config/AuthConfig';
import { TimeUnit } from '../../types/TimeTypes';
import { ResetPasswordToken } from '../../types/TokenTypes';
import Person from '../people/Person';
import TimeDuration from '../units/TimeDuration';
import Email from './Email';
import EmailFactory from './EmailFactory';

class ResetPasswordEmail extends Email {

  public constructor(to: string, token: ResetPasswordToken, author: Person = APP_AUTHOR) {
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
        ${EmailFactory.createHTMLSignature(author)}
      </p>
    `,});
  }
}

export default ResetPasswordEmail;