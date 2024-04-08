import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { logger } from '../../utils/logger';

const GMAIL_TRANSPORTER = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'd.leclerc.pro@gmail.com',
    pass: 'Q123456789',
  },
});



abstract class Emailer {
  protected transporter: Transporter<SMTPTransport.SentMessageInfo>;

  protected constructor(transporter: Transporter<SMTPTransport.SentMessageInfo>) {
    this.transporter = transporter;
  }

  public async send(html: string, subject: string, to: string, from: string) {
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      logger.info(`E-mail successfully sent: ${info.messageId}`);

    } catch (err: unknown) {
      logger.error(`Failed to send e-mail: ${err}`);
      throw err;
    }
  }
}

export default Emailer;