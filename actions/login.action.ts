'use server'

import { LoginSchema, LoginSchemaInfer } from "@/schemas/validations/login.schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { EProviders } from "@/types/auth/providers.enum";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: LoginSchemaInfer) => {
	const validateFields = LoginSchema.safeParse(values)
	
	if (!validateFields.success) return {error: 'Invalid fields!'}
	
	const {email, password} = validateFields.data
	const existingUser = await getUserByEmail(email)
	
	if (!existingUser || !existingUser.email || !existingUser.password) return {error: 'Email doesn`t exist!'}
	if (existingUser && !existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(existingUser.email)
		
		await sendVerificationEmail(verificationToken.email, verificationToken.token)
		
		return {success: 'Confirmation email sent!'}
	}
	
	try {
		await signIn(EProviders.Credentials, {
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