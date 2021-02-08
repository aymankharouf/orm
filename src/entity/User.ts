import { IsEmail, Length } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    @Length(5, 255, {message: 'name must be more than 4 characters'})
    name: string;

    @IsEmail()
    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created: Date

    @UpdateDateColumn()
    updated: Date

}
