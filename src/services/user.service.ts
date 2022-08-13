import { IRegister, IUserId } from 'user.types';
import User from '../models/User';
import ApiError from '../exceptions/api.error';
import bcrypt from 'bcryptjs';

interface IFindUser {
    _id?: string;
    username?: string;
    email?: string;
}


export default class UserService {
    async register(userData: IRegister) {
        return await User.create(userData);
    }

    async login(username: string, password: string) {
        const user = await User.findOne({ username });
        if (!user) {
            throw ApiError.BadRequestError('User with such username is not found');
        }
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw ApiError.UnauthorizedError();
        }
        return user;
    }

    async findOne(filter: IFindUser) {
        return User.findOne(filter);
    }

    async deleteOne(userId: IUserId) {
        return User.findOneAndDelete(userId);
    }

    async activate(activationLink: string) {
        const user = await User.findOne({ activationLink });
        if (!user) {
            throw new ApiError(404, 'Incorrect activation link!');
        }
        user.isActivated = true;
        await user.save();

    }
}
