import { Modules } from "src/module/entities/module.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Modules, modules => modules.course, { cascade: true })
    modules: Modules[]
}