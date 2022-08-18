import { Request, Response, NextFunction } from 'express';
import ApiError from '../exceptions/api.error';
import TokenService from '../services/token.service';

export default function(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const user = TokenService.validateAccessToken(accessToken);
        if (!user) {
            return next(ApiError.UnauthorizedError());
        }
        // @ts-ignore
        req.user = user;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}
