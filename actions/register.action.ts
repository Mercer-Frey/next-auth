'use server'

import { RegisterSchema, RegisterSchemaInfer } from "@/schemas/validations/register.schema";

export const register = async (values: RegisterSchemaInfer) => {
	const validateFields = RegisterSchema.safeParse(values)
	
	if (!validateFields.success) return {error: 'Invalid fields!'}
	
	return {success: 'Email sent!'}
}