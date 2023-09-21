import { Test, TestingModule } from '@nestjs/testing';
import { TransactionGateway } from './transaction.gateway';
import { TransactionService } from './transaction.service';

describe('TransactionGateway', () => {
  let gateway: TransactionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionGateway, TransactionService],
    }).compile();

    gateway = module.get<TransactionGateway>(TransactionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
