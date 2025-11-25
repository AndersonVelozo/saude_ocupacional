import { Test, TestingModule } from '@nestjs/testing';
import { AsoService } from './aso.service';

describe('AsoService', () => {
  let service: AsoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsoService],
    }).compile();

    service = module.get<AsoService>(AsoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
