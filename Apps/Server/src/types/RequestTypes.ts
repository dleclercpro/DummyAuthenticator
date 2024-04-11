import Session from '../models/auth/Session';

declare global {
    namespace Express {
        interface Request {
            session: Session,
        }
    }
}