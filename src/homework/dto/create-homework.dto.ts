import { ApiProperty } from "@nestjs/swagger";

export class CreateHomeworkDto {

    @ApiProperty()
    taskNumber:number;

    @ApiProperty()
    title:string;
    
    @ApiProperty()
    description:string;
    
    @ApiProperty()
    moduleGroupsId:number;
}