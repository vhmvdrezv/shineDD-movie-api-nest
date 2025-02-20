import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) { };

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: this.configService.get('EMAIL_USER'),
            pass: this.configService.get('EMAIL_PASS'),
        }
    })

    async sendEmail(sendEmailDto: SendEmailDto) {
        const { recipient, subject, html, text } = sendEmailDto;
    
        const mailOptions: nodemailer.SendMailOptions = {
          from: this.configService.get('EMAIL_USER'),
          to: recipient,
          subject,
          html, // valid HTML body
          text, // plain text body
        };

        await this.transporter.sendMail(mailOptions);
    }
}
