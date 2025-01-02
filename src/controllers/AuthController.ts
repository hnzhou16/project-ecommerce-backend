import {Request, Response} from "express";
import {UserEntity} from "../entity/User.entity";
import {validate} from "class-validator";
import {CLog} from "../AppHelper";
import gDB from "../InitDataSource";
import * as jwt from 'jsonwebtoken';
import {sendEmail} from "../helper/SendEmail";

export class AuthController {
    // make the UserRepo static to use it for all function
    static UserRepo = gDB.getRepository(UserEntity)

    static async signUp(req: Request, res: Response) {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({message: 'Invalid email or password.'})
        }

        let user = new UserEntity()
        user.email = email
        user.password = password
        user.hashPassword()

        try {
            const emailErrors  = await validate(user, {groups: ['email']})
            if (emailErrors .length > 0) {
                CLog.bad("Email validation failed: ", emailErrors )
                return res.status(400).json({
                    message: "Email validation failed: ",
                    errors: emailErrors
                })
            }

            const existingUser = await AuthController.UserRepo.findOne({where: {email}})

            if (existingUser) {
                console.log("Email already exists.")
                return res.status(400).json({message: 'Email already exists.'});
            }

            const passwordErrors = await validate(user, {groups: ['password']})
            if (passwordErrors.length > 0) {
                CLog.bad("Password validation failed: ", passwordErrors)
                return res.status(400).json({
                    message: "Password validation failed: ",
                    errors: passwordErrors
                })
            }

            const savedUser = await AuthController.UserRepo.save(user)

            return res.status(200).send(`User info, ${savedUser.id}, ${savedUser.email}`)
        } catch (err) {
            CLog.bad("Sign up failed: ", err)
            return res.status(400).send("Sign up failed.")
        }
    }

    static async logIn(req: Request, res: Response) {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).send("Please enter your email and password.")
        }

        let user = new UserEntity()
        user.email = email
        user.password = password

        try {
            const error = await validate(user, {groups: ['email', 'password']})
            if (error.length > 0) {
                CLog.bad("Validation failed: ", error)
                return res.status(400).send({
                    "Validation failed: ": error
                })
            }

            let existingUser = await AuthController.UserRepo.findOneOrFail({where: {email: email}})

            if (!existingUser) {
                CLog.bad("User not found.")
                return res.status(400).send("User not found.")
            }

            const isPasswordCorrect = existingUser.validatePlainPassword(password)

            if (!isPasswordCorrect) {
                return res.status(400).send('Incorrect password')
            }

            const token = jwt.sign(
                {id: existingUser.id, email: existingUser.email, firstName: existingUser.firstName, lastName: existingUser.lastName},
                process.env.JWT_SECRET,
                {expiresIn: '2h'}
            )
            const userInfo = {...existingUser}
            delete userInfo.password
            return res.status(200).send({user: userInfo, token})
        } catch (err) {
            CLog.bad('Login failed.')
            return res.status(400).send('Login failed, please check your email and password. Try Again!')
        }
    }

    static async resetToken(req: Request, res: Response) {
        const {email} = req.body

        if (!email) {
            return res.status(401).send(`invalid email or password.`)
        }

        try {
            const user = await AuthController.UserRepo.findOne({ where: {email: email} })

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            user.generateResetToken()
            await AuthController.UserRepo.save(user)

            // http://localhost:3399/reset-password/ee0251ffb31e4699c89624b022967fb42bb771d1
            const resetURL = `${req.protocol}://localhost:3000/account/reset-password/${user.resetToken}`;
            await sendEmail({
                to: user.email,
                subject: 'Password Reset',
                text: `You requested a password reset. Use the link below to reset your password:\n\n${resetURL}`,
            });

            return res.status(201).json({
                message: 'Password reset email sent',
                token: user.resetToken,
            })
        } catch (err) {
            CLog.bad('Reset failed', err)
            res.status(400).send(`Login failed:, ${err}`)
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { resetToken } = req.params;
            const { newPassword } = req.body;

            // Find the user by reset token and check token validity
            const user = await AuthController.UserRepo.findOne({
                where: {
                    resetToken,
                    // resetTokenExpiry: { $gt: Date.now() }, // Check if token is still valid
                },
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            // Update the user's password and clear the reset token
            user.password = newPassword;
            user.hashPassword()

            user.resetToken = null;
            user.resetTokenExpiry = null;
            await AuthController.UserRepo.save(user);

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
}