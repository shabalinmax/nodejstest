import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/register.js";
import UserModel from "./models/User.js"
import bcrypt from 'bcrypt'
import { authValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
    .connect('mongodb+srv://admin:12345@cluster0.kqdgxa3.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Connected!'))
    .catch((err) => console.log('error', err))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/auth/register', registerValidation, async (req, res) => {
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
})

app.post('/auth/login', authValidation, async (req, res) => {
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
})

app.get('/auth/me', checkAuth, async (req, res) => {
    res.json('fine')
})

app.listen(4444, (err) => {
    if (err) {
        console.log('error', err)
    }
    console.log('fine')
} )