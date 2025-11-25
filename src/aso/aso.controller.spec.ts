import { Test, TestingModule } from '@nestjs/testing';
import { AsoController } from './aso.controller';

describe('AsoController', () => {
  let controller: AsoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsoController],
    }).compile();

    controller = module.get<AsoController>(AsoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
