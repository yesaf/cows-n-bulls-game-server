export interface IRoom {
    _id?: string;
    name: string;
    password?: string;
    open?: boolean;
    creatorId: string;
    users: string[];
}

export interface IRoomCreate {
    name: string;
    password?: string;
    open?: boolean;
}

export interface IRoomUpdate {
    open?: boolean;
    users?: string[];
}

interface INameRegex {
    $regex: string;
    $options: "i";
}

interface IPasswordExistence {
    $exists: string | boolean;
}

export interface IRoomFilter {
    _id?: string;
    name?: string | INameRegex;
    password?: string | boolean | IPasswordExistence;
    open?: boolean;
}
