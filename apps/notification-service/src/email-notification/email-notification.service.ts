import {
  PasswordResetNotificationData,
  RegistrationNotificationData,
  TransferCreditNotificationData,
} from '@app/shared/dto/notification/notificationTypes';
import { FileModel } from '@app/shared/model/file.model';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EmailNotificationService implements OnApplicationBootstrap {
  logger = new Logger(EmailNotificationService.name);
  private logo;
  private twitterLogo;
  private instagramLogo;
  private facebookLogo;
  private linkedinLogo;
  private emailIllustration1;
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    @Inject(RABBITMQ_QUEUES.FILE_SERVICE) private fileClient: ClientProxy,
  ) {}
  async onApplicationBootstrap() {
    //ogo
    const logoFile = await lastValueFrom(
      this.fileClient.send<FileModel>('getFile', { title: 'logo' }),
    );
    this.logo = logoFile.path;

    //twitter
    const twitterLogoFile = await lastValueFrom(
      this.fileClient.send<FileModel>('getFile', { title: 'twitterLogo' }),
    );
    this.twitterLogo = twitterLogoFile.path;

    //instagram
    const instagramLogoFile = await lastValueFrom(
      this.fileClient.send<FileModel>('getFile', { title: 'instagramLogo' }),
    );
    this.instagramLogo = instagramLogoFile.path;

    //facebook
    const facebookLogoFile = await lastValueFrom(
      this.fileClient.send<FileModel>('getFile', { title: 'facebookLogo' }),
    );
    this.facebookLogo = facebookLogoFile.path;

    //linkinLogo
    const linkedinLogoFile = await lastValueFrom(
      this.fileClient.send<FileModel>('getFile', { title: 'linkedinLogo' }),
    );
    this.linkedinLogo = linkedinLogoFile.path;

    //emailIllustration
    const emailIllustration1File = await lastValueFrom(
      this.fileClient.send<FileModel>('getFile', {
        title: 'emailIllustration1',
      }),
    );
    this.emailIllustration1 = emailIllustration1File.path;
  }

  async sendUserConfirmationMail(
    registrationNotificationDto: RegistrationNotificationData,
  ) {
    await this.mailerService.sendMail({
      to: registrationNotificationDto.recipientMail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to The Idea Hub! Confirm your Email',
      template: 'registrationMail',
      context: {
        logo: this.logo,
        name: registrationNotificationDto.name,
        token: registrationNotificationDto.token,
        date: registrationNotificationDto.date,
        twitterLogo: this.twitterLogo,
        twitterLink: this.configService.get('TWITTER_LINK'),
        instagramLogo: this.instagramLogo,
        instagramLink: this.configService.get('INSTAGRAM_LINK'),
        facebookLogo: this.facebookLogo,
        facebookLink: this.configService.get('FACEBOOK_LINK'),
        linkedinLogo: this.linkedinLogo,
        linkedinLink: this.configService.get('LINKEDIN_LINK'),
        emailIllustration: this.emailIllustration1,
      },
    });
    this.logger.log(
      `Registration Mail Sent to : ${registrationNotificationDto.recipientMail}`,
    );
  }
  async sendPasswordResetMail(
    passwordResetNotificationData: PasswordResetNotificationData,
  ) {
    await this.mailerService.sendMail({
      to: passwordResetNotificationData.recipientMail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Change your password',
      template: 'passwordResetMail',
      context: {
        logo: this.logo,
        passwordResetLink: passwordResetNotificationData.url,
        twitterLogo: this.twitterLogo,
        twitterLink: this.configService.get('TWITTER_LINK'),
        instagramLogo: this.instagramLogo,
        instagramLink: this.configService.get('INSTAGRAM_LINK'),
        facebookLogo: this.facebookLogo,
        facebookLink: this.configService.get('FACEBOOK_LINK'),
        linkedinLogo: this.linkedinLogo,
        linkedinLink: this.configService.get('LINKEDIN_LINK'),
        emailIllustration: this.emailIllustration1,
      },
    });
    this.logger.log(
      `Password Reset Mail Sent to : ${passwordResetNotificationData.recipientMail}`,
    );
  }
  async sendCreditWalletMail(
    transferCreditNotificationData: TransferCreditNotificationData,
  ) {
    await this.mailerService.sendMail({
      to: transferCreditNotificationData.recipientMail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Wallet Credit',
      template: 'creditWalletMail',
      context: {
        logo: this.logo,
        amount: Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'NGN',
        }).format(transferCreditNotificationData.amount),
        twitterLogo: this.twitterLogo,
        twitterLink: this.configService.get('TWITTER_LINK'),
        instagramLogo: this.instagramLogo,
        instagramLink: this.configService.get('INSTAGRAM_LINK'),
        facebookLogo: this.facebookLogo,
        facebookLink: this.configService.get('FACEBOOK_LINK'),
        linkedinLogo: this.linkedinLogo,
        linkedinLink: this.configService.get('LINKEDIN_LINK'),
        emailIllustration: this.emailIllustration1,
      },
    });
    this.logger.log(
      `Credit Wallet Mail Sent to : ${transferCreditNotificationData.recipientMail}`,
    );
  }
}
