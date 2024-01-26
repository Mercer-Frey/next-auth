'use server'

import { LoginSchema, LoginSchemaInfer } from "@/schemas/validations/login.schema";

export const login = async (values: LoginSchemaInfer) => {
	const validateFields = LoginSchema.safeParse(values)
	
	if (!validateFields.success) return {error: 'Invalid fields!'}
	
	return {success: 'Email sent!'}
}