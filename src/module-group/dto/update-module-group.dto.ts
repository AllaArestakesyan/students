import { PartialType } from '@nestjs/swagger';
import { CreateModuleGroupDto } from './create-module-group.dto';

export class UpdateModuleGroupDto extends PartialType(CreateModuleGroupDto) {}
