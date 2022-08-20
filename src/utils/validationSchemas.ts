import joi from "joi";

export const registerSchema: joi.Schema = joi.object({
    username: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: joi.string()
        .email({ minDomainSegments: 2 })
        .required(),

    password: joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
});

export const loginSchema: joi.Schema = joi.object({
    username: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
});

export const createRoomSchema: joi.Schema = joi.object({
    name: joi.string()
        .alphanum()
        .min(1)
        .max(30)
        .required(),

    password: joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

    open: joi.boolean(),
});
