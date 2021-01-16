import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt'
import { classToPlain, Exclude } from 'class-transformer'
import { IsEmail, Length } from "class-validator";

@Entity('users')
export class User extends BaseEntity{

	@Exclude()	
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@IsEmail()
	@Column({unique: true})
	email: string

	@Index()
	@Length(3, 100, {message: 'User Name must be at least 3 characters'})
	@Column({unique: true})
	username: string

	@Exclude()
	@Column()
	@Length(3,100)
	password: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 6)
	}

	toJSON() {
		return classToPlain(this)
	}
}
