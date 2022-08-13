export interface IUserData {
    _id: string;
    username: string;
    email: string;
    password: string;
    friends: IUserId[];
    isActivated: boolean;
    activationLink: string;
}

export interface IRegister {
    username: string;
    email: string;
    password: string;
    friends: IUserId[];
    activationLink: string
}

export interface ILogin {
    username: string;
    password: string;
}

export interface IUserId {
    id: string;
}
