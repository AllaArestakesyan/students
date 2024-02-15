import { Test, TestingModule } from '@nestjs/testing';
import { ModuleGroupService } from './module-group.service';

describe('ModuleGroupService', () => {
  let service: ModuleGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModuleGroupService],
    }).compile();

    service = module.get<ModuleGroupService>(ModuleGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
