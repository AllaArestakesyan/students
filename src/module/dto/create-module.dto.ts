import { ApiProperty } from "@nestjs/swagger";

export class CreateModuleDto {
    @ApiProperty()
    name:string;

    @ApiProperty()
    courseId:number
}