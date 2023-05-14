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
    .connect('mongodb+srv://admin:password@cluster0.kqdgxa3.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Connected!'))
    .catch((err) => console.log('error', err))

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
})
app.post('/auth/register', registerValidation, async (req, res) => {
    return UserController.register(req,res)
})

app.post('/auth/login', authValidation, async (req, res) => {
    return UserController.login(req,res)
})

app.get('/auth/me', checkAuth, async (req, res) => {
    return UserController.getAuth(req,res)
})

app.listen(4444, (err) => {
    if (err) {
        console.log('error', err)
    }
    console.log('fine')
} )
