import { Grade } from "src/grades/entities/grade.entity";
import { ModuleGroup } from "src/module-group/entities/module-group.entity";
import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Homework {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskNumber: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(type => ModuleGroup, moduleGroups => moduleGroups.homeworks, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    moduleGroups: ModuleGroup

    @OneToMany(type => Grade, homework => homework.homework)
    grades: Grade[]
}