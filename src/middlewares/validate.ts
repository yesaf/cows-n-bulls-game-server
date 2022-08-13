import { Request, Response, NextFunction } from 'express';
import { ValidationOptions, ValidationResult } from 'joi';
import ApiError from '../exceptions/api.error';

type Schema = {
    validate(value: any, options?: ValidationOptions | undefined): ValidationResult
};

export default function(schema: Schema) {
    function validate(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = schema.validate(req.body);
            if (validation.error) {
                throw new ApiError(400, "Validation error", [validation.error]);
            } else {
                next();
            }
        } catch (e) {
            next(e)
        }

    }

    return validate;
}
