import { ModuleGroup } from "src/module-group/entities/module-group.entity";
import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    activeModuleId: number;

    @ManyToOne(type => Teacher, teacher => teacher.groups, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    teacher: Teacher

    @OneToMany(type => Student, students => students.group)
    students: Student[]

    @OneToMany(type => ModuleGroup, moduleGroups => moduleGroups.group)
    moduleGroups: ModuleGroup[]
}