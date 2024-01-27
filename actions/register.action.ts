'use server'

import bcrypt from 'bcryptjs'
import { RegisterSchema, RegisterSchemaInfer } from "@/schemas/validations/register.schema";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: RegisterSchemaInfer) => {
	const validateFields = RegisterSchema.safeParse(values)
	
	if (!validateFields.success) return {error: 'Invalid fields!'}
	
	const {name, email, password} = validateFields.data
	const hashedPassword = await bcrypt.hash(password, 10)
	
	const existingUser = await getUserByEmail(email)
	
	if (existingUser) {
		return {error: 'Email already in use!'}
	}
	
	await db
		.user
		.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})
	
	return {success: 'User created!'}
}