export default class ApiError extends Error {
    status: number;
    errors: Error[];

    constructor(status: number, message: string, errors: Error[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, "User is not authorized")
    }

    static BadRequestError(message="Bad request", errors = []) {
        return new ApiError(400, message, errors)
    }

    static UserDataTakenError(message: string) {
        return new ApiError(409, message)
    }

    static ForbiddenError(message: string) {
        return new ApiError(403, message)
    }

}
