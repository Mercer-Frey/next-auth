'use server'

import { LoginSchema, LoginSchemaInfer } from "@/schemas/validations/login.schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: LoginSchemaInfer) => {
	const validateFields = LoginSchema.safeParse(values)
	
	if (false) return {success: "Confirmation email sent!"};
	if (!validateFields.success) return {error: 'Invalid fields!'}
	
	const {email, password} = validateFields.data
	
	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT
		})
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return {error: 'Invalid credentials!'}
				default:
					return {error: 'Something went wrong!'}
			}
		}
		throw error
	}
}