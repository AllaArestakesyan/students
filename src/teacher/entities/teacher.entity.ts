import { Group } from "src/group/entities/group.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Teacher {
    @PrimaryColumn()
    userId: number;

    @ManyToOne(type => User, user => user.teacher, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    user: User

    @OneToMany(type => Group, groups => groups.teacher)
    groups: Group[]
}