import { ApiProperty } from "@nestjs/swagger";

export class CreateGradeDto {

    @ApiProperty()
    rating:number;

    @ApiProperty()
    homeworkId:number;

    @ApiProperty()
    studentId:number;
}