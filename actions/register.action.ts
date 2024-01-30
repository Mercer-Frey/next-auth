'use server'

import bcrypt from 'bcryptjs'
import { RegisterSchema, RegisterSchemaInfer } from "@/schemas/validations/register.schema";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

interface IRegisterResult {
	success?: string;
	error?: string;
}

type Register = (values: RegisterSchemaInfer) => Promise<IRegisterResult>

export const register: Register = async (values) => {
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
	
	const verificationToken = await generateVerificationToken(email)
	
	await sendVerificationEmail(verificationToken.email, verificationToken.token)
	
	return {success: 'Confirmation email sent!'}
}