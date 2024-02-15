import { Group } from "src/group/entities/group.entity";
import { Homework } from "src/homework/entities/homework.entity";
import { Modules } from "src/module/entities/module.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ModuleGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Modules, module => module.moduleGroups, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    module: Modules

    @ManyToOne(type => Group, group => group.moduleGroups, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    group: Group

    @OneToMany(type => Homework, homework => homework.moduleGroups)
    homeworks: Homework[]
}