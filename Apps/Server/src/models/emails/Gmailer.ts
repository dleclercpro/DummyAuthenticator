import nodemailer from 'nodemailer';
import Emailer from './Emailer';
import { GMAIL_PASS, GMAIL_USER } from '../../config/AuthConfig';

const GMAIL_TRANSPORTER = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});



class Gmailer extends Emailer {
  private static instance?: Gmailer;

  public static getInstance() {
    if (!Gmailer.instance) {
      Gmailer.instance = new Gmailer(GMAIL_TRANSPORTER);
    }
    return Gmailer.instance;
  }

  public async send(html: string, subject: string, to: string, from: string = `"Dummy Authenticator" <${GMAIL_USER}>`) {
    super.send(html, subject, to, from);
  }
}

export default Gmailer.getInstance();