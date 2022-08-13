import { IUserData } from 'user.types';

class UserDto {
    username: string;
    id: string;
    isActivated: boolean;

    constructor(model: IUserData) {
        this.username = model.username;
        this.id = model._id.toString();
        this.username = model.username;
        this.isActivated = model.isActivated;
    }
}

export default UserDto;
