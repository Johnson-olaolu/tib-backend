import {
  PasswordResetNotificationData,
  RegistrationNotificationData,
  TransferCreditNotificationData,
  TransferDebitNotificationData,
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
  async sendMail({
    recipientMail,
    subject,
    userName,
    title,
    body,
    extraInfo,
  }: {
    recipientMail: string;
    subject: string;
    userName: string;
    title: string;
    body: string;
    extraInfo?: string;
  }) {
    const response = await this.mailerService.sendMail({
      to: recipientMail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject,
      template: 'defaultMail',
      context: {
        logo: this.logo,
        title,
        userName,
        body,
        extraInfo: extraInfo || false,
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
    return response;
  }

  async sendUserConfirmationMail(
    recipeint: {
      mail: string;
      name: string;
    },
    registrationNotificationDto: RegistrationNotificationData,
  ) {
    const response = await this.sendMail({
      recipientMail: recipeint.mail,
      body: `
        Please use this token 
        <strong>${registrationNotificationDto.token}</strong>
        to confirm your email
      `,
      subject: 'Welcome to TIB',
      title: 'Welcome To The Idea Bank',
      userName: recipeint.name,
      extraInfo: registrationNotificationDto.date,
    });
    this.logger.log(
      `Registration Mail Sent to : ${response?.accepted?.toString()}`,
    );
  }

  async sendPasswordResetMail(
    recipeint: {
      mail: string;
      name: string;
    },
    passwordResetNotificationData: PasswordResetNotificationData,
  ) {
    const response = await this.sendMail({
      recipientMail: recipeint.mail,
      body: `
      <a
      href='${passwordResetNotificationData.url}'
      rel='noopener'
      style='text-decoration: underline; color: #3e2d9c;'
      target='_blank'
    ><strong>click here</strong> </a>
    to change your password
      `,
      subject: 'Password Reset',
      title: 'Reset Your Password',
      userName: recipeint.name,
    });
    this.logger.log(
      `Password Reset Mail Sent to : ${response?.accepted?.toString()}`,
    );
  }

  async sendCreditWalletMail(
    recipeint: {
      mail: string;
      name: string;
    },
    transferCreditNotificationData: TransferCreditNotificationData,
  ) {
    const amount = Intl.NumberFormat('en-Gb', {
      currency: 'NGN',
      compactDisplay: 'short',
    }).format(transferCreditNotificationData.amount);
    const response = await this.sendMail({
      recipientMail: recipeint.mail,
      body: `
      Your account has been credited with
      <strong>${amount}</strong>
      `,
      subject: 'Credit Alert',
      title: 'Credit Alert',
      userName: recipeint.name,
    });
    this.logger.log(
      `Credit Wallet Mail Sent to : ${response?.accepted?.toString()}`,
    );
  }

  async sendDebitWalletMail(
    recipeint: {
      mail: string;
      name: string;
    },
    transferCreditNotificationData: TransferDebitNotificationData,
  ) {
    const amount = Intl.NumberFormat('en-Gb', {
      currency: 'NGN',
      compactDisplay: 'short',
    }).format(transferCreditNotificationData.amount);
    const response = await this.sendMail({
      recipientMail: recipeint.mail,
      body: `
      <p>Your Account has been debited ${amount}</p>
      <p> Transfer to ${transferCreditNotificationData.accountName}  ${transferCreditNotificationData.bankName} - ${transferCreditNotificationData.accountNumber}</p>
      `,
      subject: 'Debit Alert',
      title: 'Debit Alert',
      userName: recipeint.name,
    });
    this.logger.log(
      `Debit Wallet Mail Sent to : ${response?.accepted?.toString()}`,
    );
  }
}
