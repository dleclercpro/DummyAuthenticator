import { CLIENT_ROOT } from '../../config/AppConfig';
import { GMAIL_USER } from '../../config/AuthConfig';
import { TimeUnit } from '../../types/TimeTypes';
import { ConfirmEmailToken } from '../../types/TokenTypes';
import TimeDuration from '../units/TimeDuration';
import Email from './Email';

class EmailAddressConfirmationEmail extends Email {

  public constructor(to: string, token: { string: string, content: ConfirmEmailToken }) {
    const link = `${CLIENT_ROOT}/confirm-email?token=${token.string}`;

    const from = `Dummy Authenticator <${GMAIL_USER}>`;
    const subject = 'Confirm your e-mail address';

    super({ from, to, subject, html: `
      <h1>Confirm e-mail</h1>
      <p>
        Hello,
      </p>
      <p>
        You have recently signed up on the Dummy Authenticator. To confirm your e-mail address, please click on the following link:
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

export default EmailAddressConfirmationEmail;