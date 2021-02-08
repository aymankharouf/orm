import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

}
