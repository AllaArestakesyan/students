import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupDtoName {
    @ApiProperty()
    name: string;
}
export class UpdateGroupDtoTeacher {
    @ApiProperty()
    teacherId: number;
}
export class UpdateGroupDtoModule {
    @ApiProperty()
    activeModuleId: number;
}
