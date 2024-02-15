import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto {
    @ApiProperty()
    rating:number;
}