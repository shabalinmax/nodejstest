import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export class UserController {
    static register = async (req, res) => {
            try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(400).json(errors.array())
                } else {
                    const salt = await bcrypt.genSalt(10)
                    const hash = await bcrypt.hash(req.body.password, salt)
                    const doc = new UserModel({
                        email: req.body.email,
                        passwordHash: hash,
                        fullName: req.body.fullName,
                    })
                    const user = await doc.save()
                    const {passwordHash, ...userDataToResponse} = user._doc
                    const token = jwt.sign({
                        _id: user._id,
                    }, 'secret123', {expiresIn: '5m'})
                    res.json({user: userDataToResponse, token})
                }
            } catch (e) {
                res.status(500).json('Не удалось зарегистрировать пользователя.')
            }
    }
    static login = async (req,res) => {
            try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(400).json(errors.array())
                } else {
                    const user = await UserModel.findOne({email: req.body.email})
                    if (!user) {
                        return res.status(404).json("Неверн1ый логин или пароль")
                    }
                    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
                    if (!isValidPass) {
                        return res.status(404).json("Невер2ный логин или пароль")
                    }
                    const {passwordHash, ...userDataToResponse} = user._doc
                    const token = jwt.sign({
                        _id: user._id,
                    }, 'secret123', {expiresIn: '5m'})
                    res.json({user: userDataToResponse, token})
                }
            } catch (e) {
                res.status(500).json('Не удалось авторизоваться.')
            }
    }
    static getAuth = async (req,res) => {
            try {
                const user = await UserModel.findById(req.userId)
                if (!user) {
                    return res.status(404).json('Юзер не найлет')
                }
                const {passwordHash, ...userDataToResponse} = user._doc
                const token = jwt.sign({
                    _id: user._id,
                }, 'secret123', {expiresIn: '1d'})
                res.json({user: userDataToResponse, token})
            } catch (e) {
                res.status(500).json("нет доступа")
            }
    }
}