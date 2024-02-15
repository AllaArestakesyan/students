import { Grade } from "src/grades/entities/grade.entity";
import { Group } from "src/group/entities/group.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
    @PrimaryColumn()
    userId: number;

    @ManyToOne(type => User, user => user.student, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    user: User

    @ManyToOne(type => Group, group => group.students, {
        onUpdate: "SET NULL",
        onDelete: "SET NULL"
    })
    group: Group


    @OneToMany(type => Grade, homework => homework.student)
    grades: Grade[]
}