type Args = {
  from: string;
  to: string;
  subject: string;
  html: string;
}



abstract class Email {
  protected from: string;
  protected to: string;
  protected subject: string;
  protected html: string;

  protected constructor(args: Args) {
    this.from = args.from;
    this.to = args.to;
    this.subject = args.subject;
    this.html = args.html;
  }

  public getFrom() {
    return this.from;
  }

  public getTo() {
    return this.to;
  }

  public getSubject() {
    return this.subject;
  }

  public getHtml() {
    return this.html;
  }
}

export default Email;