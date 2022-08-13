import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import ApiError from '../exceptions/api.error';

export default async function(req: Request, res: Response, next: NextFunction) {
    try {
        const userService = new UserService();
        const { username, email } = req.body;

        const candidateUsername = await userService.findOne({ username });
        if (candidateUsername) {
            throw ApiError.UserDataTakenError('This username is already taken. Please, choose another one.');
        }
        const candidateEmail = await userService.findOne({ email });
        if (candidateEmail) {
            throw ApiError.UserDataTakenError('This email is already taken. Please, choose another one.');
        }
        next();
    } catch (e) {
        next(e)
    }

}
