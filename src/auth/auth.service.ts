import { Body, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SignupUserDto } from './dto/signup-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { SendEmailDto } from 'src/email/dto/send-email.dto';
import { ConfigService } from '@nestjs/config';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ConfirmForgetPassword } from './dto/confirm-forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto copy';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService
    ) { };

    async validate(username: string, password: string) {
        const user = await this.databaseService.user.findUnique({ where: { username } });
        if (!user) return null;
        const result = await bcrypt.compare(password, user.password);
        if (result) return user;
        return null;   
    }

    async login(user: User) { 
        const payload = { sub: user.id, username: user.username, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            status: 'success',
            message: '',
            data: {
                accessToken
            }
        }
    }

    async signup(signupUserDto: SignupUserDto) {
        const { email, username, password } = signupUserDto;

        const emailExists = await this.databaseService.user.findUnique({ where: { email } });
        if (emailExists) throw new ConflictException('Email already exists');
        const usernameExists = await this.databaseService.user.findUnique({ where: { username } });
        if (usernameExists) throw new ConflictException('Username already exists');
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = uuidv4();

        // creating user in db
        const newUser = await this.databaseService.user.create({
            data: {
                username, 
                email, 
                password: hashedPassword,
                verificationToken,
                verified: false
            }
        });

        // sending email verfication
    
        const verificationLink = `${this.configService.get<string>('BASE_URL')}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;


        const sendEmailDto: SendEmailDto = {
            recipient: newUser.email,
            subject: 'Email Verification',
            html: `
                <h1>Email Verification</h1>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationLink}" target="_blank">Verify Email</a>
                <p>If you didn't request this, please ignore this email.</p>
            `,
            text: `Please click the following link to verify your account: ${verificationLink}`
        };

        await this.emailService.sendEmail(sendEmailDto);

        return {
            status: 'success',
            message: 'signup successfull, please verify your email'
        }
    }

    async verifyEmail(token: string, email: string) { 
        const user = await this.databaseService.user.findUnique({ where: { email, verificationToken: token } });
        if (!user) throw new NotFoundException('email not verfied. verification token is wrong')

        await this.databaseService.user.update({ 
            where: { email },
            data: { verified: true }
        })

        return {
            status: 'success',
            message: 'user account verfied successfully'
        }
    }

    async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
        const { email } = forgetPasswordDto;

        const emailExists = await this.databaseService.user.findUnique({ where: { email } })
        if (!emailExists) throw new NotFoundException('email doesn`t exists');

        const token = uuidv4();
        await this.databaseService.forgetPassword.upsert({
            where: { email },
            update: {
                token,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            },
            create: {
                email,
                token,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            }
        });

        const verificationLink = `${this.configService.get<string>('BASE_URL')}/confirm-forget-email?token=${token}`;

        const sendEmailDto: SendEmailDto = {
            recipient: email,
            subject: 'ForgetPassword',
            html: `
                <h1>Forget Password</h1>
                <p>Click the link below to Reset your Password:</p>
                <a href="${verificationLink}" target="_blank">Forget Password</a>
                <p>If you didn't request this, please ignore this email.</p>
            `,
            text: `Please click the following link to Reset your Password: ${verificationLink}`
        };

        await this.emailService.sendEmail(sendEmailDto);

        return {
            status: 'success',
            message: 'email sent successfully'
        }
    }

    async confirmForgetPassword(confirmForgetPassword: ConfirmForgetPassword) {
        const { token, newPassword } = confirmForgetPassword;

        const forgetPassword = await this.databaseService.forgetPassword.findUnique({ where: { token } });

        if (!forgetPassword || forgetPassword.expiresAt.getTime() < Date.now()) {
            throw new HttpException('token is wrong or time expired', 400);
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await this.databaseService.user.update({
            where: {
                email: forgetPassword.email
            },
            data: {
                password: newHashedPassword
            }
        });

        await this.databaseService.forgetPassword.delete({
            where: { token }
        });

        return {
            status: 'success',
            message: 'password was updated successfully'
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email } = resetPasswordDto;

        // Check if the email exists in the database
        const emailExists = await this.databaseService.resetPassword.findUnique({ where: { email  } });
        if (!emailExists) throw new NotFoundException('Email doesnt exists');

        // Generate a unique token for password reset
        const token = uuidv4();

        // Store or update the reset token and expiration time in the database
        await this.databaseService.resetPassword.upsert({
            where: { 
                email
            },
            create: {
                email,
                token,
                expiresAt: new Date(Date.now() + 60 * 60 * 3600)
            },
            update: {
                token, 
                expiresAt: new Date(Date.now() + 60 * 60 * 3600)
            }
        });

        // Construct the verification link containing the reset token
        const verificationLink = `${this.configService.get<string>('BASE_URL')}/confirm-forget-email?token=${token}`;

        // Prepare the email content
        const sendEmailDto: SendEmailDto = {
            recipient: email,
            subject: 'ResetPassword',
            html: `
                <h1>Reset Password</h1>
                <p>Click the link below to Reset your Password:</p>
                <a href="${verificationLink}" target="_blank">Forget Password</a>
                <p>If you didn't request this, please ignore this email.</p>
            `,
            text: `Please click the following link to Reset your Password: ${verificationLink}`
        };

        // Send the email using an email service
        await this.emailService.sendEmail(sendEmailDto);

        return {
            status: 'success',
            message: 'reset-email sent to user.'
        };
    }

    async confirmResetPassword(confirmResetPasswordDto: ConfirmResetPasswordDto) {
        const { newPassword, token } = confirmResetPasswordDto;

        const resetPassword = await this.databaseService.resetPassword.findUnique({
            where: {
                token
            }
        });

        // Ensure token is still valid
        if (!resetPassword || resetPassword.expiresAt.getTime() < Date.now()) {
            throw new HttpException('token is wrong or timedout', 400);
        }

        // Hash new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Use transaction to prevent race conditions
        await this.databaseService.$transaction([
            this.databaseService.user.update({
                where: { email: resetPassword.email },
                data: { password: newHashedPassword },
            }),
            this.databaseService.resetPassword.delete({
                where: { email: resetPassword.email },
            }),
        ]);

        return {
            status: 'success',
            message: 'password was reset successfully'
        };
    }
}
