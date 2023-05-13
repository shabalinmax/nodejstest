import {body} from "express-validator";
export const authValidation = [
    body("email", "Неверный формат email").isEmail(),
    body("password", "Неверный формат password ").isLength({min: 5, max: 18}),
]