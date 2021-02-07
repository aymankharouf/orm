import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity{

	@PrimaryGeneratedColumn()
	id: number

	@Column({unique: true})
	email: string

	@Column({unique: true})
	username: string

	@Column()
	password: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
