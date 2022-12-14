import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import TokenService from '../services/token.service';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import MailService from '../services/mail.service';
import UserDto from '../dtos/user.dto';
import { IUserData } from 'user.types';
import ApiError from '../exceptions/api.error';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class UserController {
    constructor(
        private userService: UserService,
        private mailService: MailService,
        private tokenService: TokenService) {
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;

            const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const activationLink = v4();

            const user = await this.userService.register({
                username,
                email,
                password: hashPassword,
                friends: [],
                activationLink,
            });
            await this.mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
            // @ts-ignore
            return this.getAuth(user, res)
        } catch (e) {
            next(e)
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link;
            await this.userService.activate(activationLink);
            // @ts-ignore
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e)
        }

    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const login = await this.userService.login(username, password);
            if (login) {
                // @ts-ignore
                return this.getAuth(login, res)
            }
        } catch (e) {
            next(e)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const token = await this.tokenService.delete(refreshToken);
            res.clearCookie('refreshToken');
            return {
                message: "Logout success",
                token
            };
        } catch (e) {
            next(e)
        }

    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await this.tokenService.refresh(refreshToken);
            // @ts-ignore
            const user = await this.userService.findOne({ _id: userData.id});
            if (!user) {
                throw ApiError.UnauthorizedError();
            }
            // @ts-ignore
            return this.getAuth(user, res);
        } catch (e) {
            next(e);
        }
    }

    async checkAuth(req: Request, _res: Response, _next: NextFunction) {
        // All check is done in auth middleware
        return { message: "Authenticated successfully", user: req.user};
    }

    async getUserById(req: Request, _res: Response, next: NextFunction) {
        try {
            const { _id } = req.query;
            if (!(typeof _id === 'string')) {
                throw ApiError.BadRequestError('No user id was passed');
            }
            const user = await this.userService.findOne({ _id });
            if (user) {
                return {
                    _id: user._id,
                    username: user.username,
                    friend: user.friends,
                };
            }
            return user;
        } catch (e) {
            next(e);
        }
    }

    private async getAuth(user: IUserData, res: Response) {
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
        res.cookie(
            'refreshToken',
            tokens.refreshToken,
            {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // calculated 30 days
            });

        return {
            message: "Authorized successfully",
            ...tokens,
            user: userDto,
        };
    }

}

export default new UserController(new UserService(), new MailService(), new TokenService())
