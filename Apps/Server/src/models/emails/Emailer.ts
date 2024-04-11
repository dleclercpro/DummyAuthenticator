import Email from './Email';

abstract class Emailer {
  public abstract send(email: Email): Promise<void>;
}

export default Emailer;