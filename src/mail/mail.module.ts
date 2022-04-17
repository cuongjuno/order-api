import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Global() // 👈 optional to make module global
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const oAuth2Client = new google.auth.OAuth2(
          config.get<string>('OAUTH_CLIENTID'),
          config.get<string>('OAUTH_CLIENT_SECRET'),
          config.get<string>('REDIRECT_URI'),
        );
        oAuth2Client.setCredentials({
          refresh_token: config.get<string>('OAUTH_REFRESH_TOKEN'),
        });
        const accessToken = await oAuth2Client.getAccessToken();

        return {
          transport: {
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: config.get<string>('MAIL_USERNAME'),
              clientId: config.get<string>('OAUTH_CLIENTID'),
              clientSecret: config.get<string>('OAUTH_CLIENT_SECRET'),
              refreshToken: config.get<string>('OAUTH_REFRESH_TOKEN'),
              accessToken,
            },
          },
          defaults: {
            from: `"No Reply" <${config.get('MAIL_FROM')}>`,
          },
          template: {
            dir: process.cwd() + '/template/',
            adapter: new HandlebarsAdapter(), // or new PugAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
