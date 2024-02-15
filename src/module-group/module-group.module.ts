import { Module } from '@nestjs/common';
import { ModuleGroupService } from './module-group.service';
import { ModuleGroupController } from './module-group.controller';

@Module({
  controllers: [ModuleGroupController],
  providers: [ModuleGroupService]
})
export class ModuleGroupModule {}
