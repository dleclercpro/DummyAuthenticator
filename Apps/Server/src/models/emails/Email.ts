type Args = {
  from: string;
  to: string;
  subject: string;
  content: string;
}



abstract class Email {
  protected from: string;
  protected to: string;
  protected subject: string;
  protected content: string;

  protected constructor(args: Args) {
    this.from = args.from;
    this.to = args.to;
    this.subject = args.subject;
    this.content = args.content;
  }
}

export default Email;