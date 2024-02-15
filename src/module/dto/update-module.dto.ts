import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';

export class UpdateModuleDto {
    @ApiProperty()
    name: string
}

export class ChangeModuleDto {
    @ApiProperty()
    courseId: number
}
