import UserDto from '../dtos/user.dto';

export {};

declare global {
    namespace Express {
        interface Request {
            user: UserDto;
        }
    }
}
