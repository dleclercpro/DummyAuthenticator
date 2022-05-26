import Session from '../models/Session';

declare global {
    namespace Express {
        interface Request {
            session: Session,
        }
    }
}