import Token from '../models/token';
import jwt from 'jsonwebtoken';
import config from 'config';
import ApiError from '../exceptions/api.error';
import UserDto from '../dtos/user.dto';

export default class TokenService {

    static generateTokens(payload: UserDto) {
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

    static validateAccessToken( token: string ) {
        try {
            return jwt.verify(token, config.get('jwtAccessSecret'))
        } catch (e) {
            return null
        }

    }

    static validateRefreshToken( token: string ) {
        try {
            return jwt.verify(token, config.get('jwtRefreshSecret'))
        } catch (e) {
            return null
        }
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

    async delete( refreshToken: string ) {
        return Token.deleteOne({ refreshToken });
    }

    async refresh( refreshToken: string ) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userAndToken = Token.findOne({ refreshToken });
        const payload = TokenService.validateRefreshToken(refreshToken);

        if (!userAndToken || !payload) {
            throw ApiError.UnauthorizedError();
        }
        return payload;

    }
}
