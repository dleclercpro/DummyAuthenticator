import { APP_AUTHOR, CLIENT_ROOT } from '../../config/AppConfig';
import { GMAIL_USER } from '../../config/AuthConfig';
import { TimeUnit } from '../../types/TimeTypes';
import { ConfirmEmailToken } from '../../types/TokenTypes';
import Person from '../people/Person';
import TimeDuration from '../units/TimeDuration';
import Email from './Email';
import EmailFactory from './EmailFactory';

class EmailAddressConfirmationEmail extends Email {

  public constructor(to: string, token: { string: string, content: ConfirmEmailToken }, author: Person = APP_AUTHOR) {
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
        ${EmailFactory.createHTMLSignature(author)}
      </p>
    `,});
  }
}

export default EmailAddressConfirmationEmail;