import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  IBankDetails,
  IInitializeTransactionResponse,
  IPaystackResponse,
  IRecipientDetails,
  ITransactionDetails,
  account_type,
  currency,
} from './types';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'querystring';

@Injectable()
export class PaystackService {
  private callbackUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.callbackUrl = `${configService.get(
      'API_GATEWAY_BASE_URL',
    )}/transaction/verify-transaction`;
  }

  async initiateTransaction(
    email: string,
    amount: number,
    reference: string,
    currency = 'NGN',
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<IPaystackResponse<IInitializeTransactionResponse>>(
          '/transaction/initialize',
          {
            email,
            amount: amount * 100,
            // callback_url: this.callbackUrl,
            callback_url: `${this.configService.get(
              'API_GATEWAY_BASE_URL',
            )}/transaction/verify-credit-transaction-paystack`,
            reference,
            currency,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async verifyTransaction(reference: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IPaystackResponse<ITransactionDetails>>(
          `/transaction/verify/${reference}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );

    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async listTransactions(
    perPage = 50,
    page = 1,
    status?: string,
    from?: Date,
    to?: Date,
    amount?: number,
  ) {
    const query = stringify({
      perPage,
      page,
      status,
      from: from.toString(),
      to: to.toString(),
      amount,
    });
    const { data } = await firstValueFrom(
      this.httpService
        .get<IPaystackResponse<ITransactionDetails[]>>(`/transaction?${query}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );

    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async fetchTransaction(transactionId: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IPaystackResponse<ITransactionDetails>>(
          `/transaction/${transactionId}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );

    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async getBanks() {
    const { data } = await firstValueFrom(
      this.httpService.get<IPaystackResponse<IBankDetails[]>>(`/bank`).pipe(
        catchError((error: AxiosError) => {
          throw new RpcException(
            new InternalServerErrorException(error.response),
          );
        }),
      ),
    );

    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async resolveAccount(bank_code: string, account_number) {
    const query = stringify({
      bank_code,
      account_number,
    });
    const { data } = await firstValueFrom(
      this.httpService
        .get<
          IPaystackResponse<{
            account_number: string;
            account_name: string;
          }>
        >(`/bank/resolve?${query}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );

    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async validateAccount(
    bank_code: number,
    account_number: string,
    account_name: string,
    account_type: 'personal' | 'business' = 'personal',
    country_code = 'NG',
    document_type:
      | 'identityNumber'
      | 'passportNumber'
      | 'businessRegistrationNumber' = 'identityNumber',
    document_number?: number,
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<
          IPaystackResponse<{
            verified: boolean;
            verificationMessage: string;
          }>
        >('/bank/validate', {
          bank_code,
          country_code,
          account_number,
          account_name,
          account_type,
          document_type,
          document_number,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  //Outward Transfer
  async createRecipient(
    name: string,
    account_number: string,
    bank_code: string,
    currency: currency = 'NGN',
    type: 'nuban' | 'mobile_money' | 'basa' = 'nuban',
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<IPaystackResponse<IRecipientDetails>>('/transferrecipient', {
          type,
          name,
          account_number,
          bank_code,
          currency,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async getRecipeint(recipientCode: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IPaystackResponse<IRecipientDetails>>(
          `/transferrecipient/${recipientCode}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async updateRecipeint(
    recipientId: string,
    name: string,
    account_number: string,
    bank_code: string,
    currency: currency = 'NGN',
    type: account_type = 'nuban',
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .put<IPaystackResponse<IRecipientDetails>>(
          `/transferrecipient/${recipientId}`,
          {
            type,
            name,
            account_number,
            bank_code,
            currency,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async deleteRecipeint(recipientId: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete<IPaystackResponse<null>>(`/transferrecipient/${recipientId}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async initiateTransfer(
    recipient: string,
    amount: number,
    reference: string,
    reason: string,
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<IPaystackResponse<ITransactionDetails>>('/transfer', {
          source: 'balance',
          reason,
          amount: amount * 100,
          recipient,
          reference,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.message),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async verifyTransfer(reference: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IPaystackResponse<ITransactionDetails>>(
          `/transfer/verify/${reference}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );

    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }

  async fetchTransfer(transferId: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<
          IPaystackResponse<{
            verified: boolean;
            verificationMessage: string;
          }>
        >(`/transfer/${transferId}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new RpcException(
              new InternalServerErrorException(error.response),
            );
          }),
        ),
    );
    if (data.status) {
      return data.data;
    } else {
      throw new RpcException(new InternalServerErrorException(data.message));
    }
  }
}
