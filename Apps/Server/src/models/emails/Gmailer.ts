import nodemailer, { Transporter } from 'nodemailer';
import Emailer from './Emailer';
import { GMAIL_PASS, GMAIL_USER } from '../../config/AuthConfig';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { logger } from '../../utils/logger';
import Email from './Email';

const GMAIL_TRANSPORTER = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});



class Gmailer extends Emailer {
  private static instance?: Gmailer;

  protected transporter: Transporter<SMTPTransport.SentMessageInfo>;

  private constructor(transporter: Transporter<SMTPTransport.SentMessageInfo>) {
    super();
    
    this.transporter = transporter;
  }

  public static getInstance() {
    if (!Gmailer.instance) {
      Gmailer.instance = new Gmailer(GMAIL_TRANSPORTER);
    }
    return Gmailer.instance;
  }

  public async send(email: Email) {
    try {
      logger.debug(`Sending e-mail to: ${email.getTo()}`);

      await this.transporter.sendMail({
        from: email.getFrom(),
        to: email.getTo(),
        subject: email.getSubject(),
        html: email.getHtml(),
      });
      
      logger.debug(`E-mail successfully sent.`);

    } catch (err: unknown) {
      logger.error(`Failed to send e-mail: ${err}`);
      
      throw err;
    }
  }
}

export default Gmailer.getInstance();