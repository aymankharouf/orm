import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

}