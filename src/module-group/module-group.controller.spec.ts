import { Test, TestingModule } from '@nestjs/testing';
import { ModuleGroupController } from './module-group.controller';
import { ModuleGroupService } from './module-group.service';

describe('ModuleGroupController', () => {
  let controller: ModuleGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuleGroupController],
      providers: [ModuleGroupService],
    }).compile();

    controller = module.get<ModuleGroupController>(ModuleGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
