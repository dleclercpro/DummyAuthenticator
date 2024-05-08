import { getRandomWord } from '../../utils/string';
import UserSecret from '../user/UserSecret';



// Singleton
class SecretManager {
  private static instance?: SecretManager;

  private constructor() {

  }

  public static getInstance() {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }

  public async renew(secret: UserSecret) {
    const now = new Date();

    secret.setValue(getRandomWord());
    secret.incrementResetCount();
    secret.setLastReset(now);

    return secret;
  }
}

export default SecretManager.getInstance();