import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailData } from './interfaces/send-email-data.interface';
import { google } from 'googleapis';

@Injectable()
export class SendEmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(data: SendEmailData): Promise<void> {
    // const transporter = createTransport({
    //   host: this.configService.get<string>('MAIL_HOST'),
    //   port: this.configService.get<number>('MAIL_PORT'),
    //   secure: this.configService.get<boolean>('MAIL_SECURE'),
    //   auth: {
    //     user: this.configService.get<string>('MAIL_USER'),
    //     pass: this.configService.get<string>('MAIL_PASS'),
    //   },
    // });

    const oAuth2Client = new google.auth.OAuth2(
      this.configService.get<string>('OAUTH_CLIENTID'),
      this.configService.get<string>('OAUTH_CLIENT_SECRET'),
      this.configService.get<string>('REDIRECT_URI'),
    );
    oAuth2Client.setCredentials({
      refresh_token: this.configService.get<string>('OAUTH_REFRESH_TOKEN'),
    });
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('MAIL_USERNAME'),
        // pass: this.configService.get<string>('MAIL_PASSWORD'),
        clientId: this.configService.get<string>('OAUTH_CLIENTID'),
        clientSecret: this.configService.get<string>('OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get<string>('OAUTH_REFRESH_TOKEN'),
        accessToken,
      },
    });

    const mailOptions = {
      from: this.configService.get<string>('MAIL_SENDER'),
      to: data.to,
      subject: data.subject,
      text: data.content,
    };

    return new Promise<any>((resolve, reject) => {
      console.log('vao dat', this.configService.get<string>('MAIL_USERNAME'));

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(`error: ${error}`);
        } else {
          resolve(info);
        }
      });
    });
  }
}
