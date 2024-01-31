'use server'

import { LoginSchema, LoginSchemaInfer } from '@/schemas/validations/login.schema'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { EProviders } from '@/types/auth/providers.enum'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { getUserByEmail } from '@/data/user'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'

interface ILoginResult {
	success?: string;
	error?: string;
	twoFactor?: boolean;
}

type Login = (values: LoginSchemaInfer, callbackUrl?: string | null,) => Promise<ILoginResult>

export const login: Login = async (values, callbackUrl) => {
	const validateFields = LoginSchema.safeParse(values)
	
	if (!validateFields.success) return {error: 'Invalid fields!'}
	
	const {email, password, code} = validateFields.data
	const existingUser = await getUserByEmail(email)
	
	if (!existingUser || !existingUser.email || !existingUser.password) return {error: 'Email doesn`t exist!'}
	if (existingUser && !existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(existingUser.email, existingUser.id)
		
		await sendVerificationEmail(verificationToken.email, verificationToken.token)
		
		return {success: 'Confirmation email sent!'}
	}
	
	if (existingUser.isTwoFactorAuth && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
			
			if (!twoFactorToken) return {error: 'Invalid Code!'}
			if (twoFactorToken.token !== code) return {error: 'Invalid Code!'}
			
			const hasExpired = new Date(twoFactorToken.expires) < new Date()
			
			if (hasExpired) return {error: 'Code expired!'}
			
			await db
				.twoFactorToken
				.delete({
					where: {id: twoFactorToken.id}
				})
			
			const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
			
			if (existingConfirmation) {
				await db
					.twoFactorConfirmation
					.delete({
						where: {id: existingConfirmation.id}
					})
			}
			
			await db
				.twoFactorConfirmation
				.create({
					data: {
						userId: existingUser.id,
					}
				})
			
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email)
			
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
			
			return {twoFactor: true}
		}
	}
	
	try {
		await signIn(EProviders.Credentials, {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		})
		
		return {}
		
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