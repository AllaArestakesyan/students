import { Course } from "src/course/entities/course.entity";
import { ModuleGroup } from "src/module-group/entities/module-group.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Modules {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @ManyToOne(type => Course, course =>course.modules, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    course: Course

    @OneToMany(type => ModuleGroup, moduleGroups => moduleGroups.module)
    moduleGroups: ModuleGroup[]
}