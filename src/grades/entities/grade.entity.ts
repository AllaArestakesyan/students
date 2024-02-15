import { Homework } from "src/homework/entities/homework.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Grade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating:number;
    
    @ManyToOne(type => Student, student =>student.grades, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    student: Student
    
    @ManyToOne(type => Homework, homework =>homework.grades, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    homework: Homework
}