import {body} from "express-validator";

export const registerValidation = [
    body('email', "Неверный формат email ").isEmail(),
    body('password', "Неверный формат password ").isLength({min: 5, max: 18}),
    body('fullName', "Неверный формат fullName ").isLength({min: 3}),
    body('avatarUrl', "Неверный формат avatarUrl ").optional().isURL(),
]