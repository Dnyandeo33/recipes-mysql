import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import query from '../config/db.js';
import '../models/user.js';
import hashPassword from '../utils/hashPassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';

const userControllers = {
    register: async (req, res) => {
        const { email, password, rePassword } = req.body;
        try {
            const registerUser = `SELECT * FROM users where email=?`
            const result = query(registerUser, [email]);

            if (result.length > 0) {
                return res.status(200).json({ success: true, message: `Email already exists...` })
            }
            const isValidEmail = validateEmail(email);
            const isValidPassword = validatePassword(password);
            const isVerifyPassword = matchPasswords(password, rePassword);

            if (isValidEmail && isValidPassword && isVerifyPassword) {
                const hashedPassword = hashPassword(password);
                const insertValue = `INSERT INTO users(email, password) VALUES(?,?)`
                const addUser = await query(insertValue, [email, hashedPassword]);
                return res.status(201).json({ success: true, message: `User with id ${email} created successfully...` })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const getCredential = `SELECT * FROM users where email=?`
            const result = await query(getCredential, [email])

            if (result.length > 0) {

                const user = result[0];
                const isValid = bcrypt.compare(password, user.password);

                if (isValid) {
                    const token = jwt.sign({ user: user }, process.env.TOKEN_ACCESS_SECRET)
                    res.cookie('token', token, { httpOnly: true, sameSite: true });
                    return res.status(200).json({ success: true, token: token })
                } else {
                    res.status(401).json({ success: false, message: `Email or password not valid` })
                }
            } else {
                return res.status(404).json({ success: false, message: `User not found, please register...` })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })

        }
    },

    logout: async (req, res) => {

        try {
            await res.clearCookie('token');
            return res.status(200).json({ success: true, message: `User logged out successfully...` });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    },
};

export default userControllers;
