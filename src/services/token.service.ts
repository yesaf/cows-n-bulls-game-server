import Token from '../models/token'
import { IUserIdAndToken } from 'token.type';
import jwt from 'jsonwebtoken';
import config from 'config';

export default class TokenService {

    static async generateTokens(payload: any) {
        const accessToken = jwt.sign(
            payload,
            config.get("jwtAccessSecret"),
            {expiresIn: config.get("jwtAccessExpiresIn")
            });
        const refreshToken = jwt.sign(
            payload,
            config.get("jwtRefreshSecret"),
            {expiresIn: config.get("jwtRefreshExpiresIn")
            });
        return { accessToken, refreshToken }
    }

    async saveToken(user: string, refreshToken: string) {
        if (await Token.findOne({ user })) {
            return await this.update(user, refreshToken);
        }
        return await Token.create({ user, refreshToken });
    }

    async update( user: string, refreshToken: string ) {
        await Token.updateOne({ user }, { refreshToken });
        return Token.findOne({ user });
    }

    async delete( userAndToken: IUserIdAndToken ) {
        return Token.deleteOne(userAndToken);
    }
}
