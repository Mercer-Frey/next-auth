'use server'

import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { SettingsSchemaInfer } from '@/schemas/validations/settings.schema'
import { unstable_update } from '@/auth'

export const settings = async (values: SettingsSchemaInfer) => {
	const user = await currentUser()
	
	if (!user) return {error: 'Unauthorized'}
	
	const dbUser = await getUserById(user.id)
	
	if (!dbUser) return {error: 'Unauthorized'}
	
	if (user.isOAuth) {
		values.email = undefined
		values.password = undefined
		values.newPassword = undefined
		values.isTwoFactorAuth = undefined
	}
	
	if (values.email && values.email !== user.email) {
		const existingUser = await getUserByEmail(values.email)
		
		if (existingUser && existingUser.id !== user.id) return {error: 'Email already in use!'}
		
		const verificationToken = await generateVerificationToken(values.email, user.id!)
		
		await sendVerificationEmail(verificationToken.email, verificationToken.token,)
		
		return {success: 'Verification email sent!'}
	}
	
	if (values.password && values.newPassword && dbUser.password) {
		const passwordsMatch = await bcrypt.compare(values.password, dbUser.password,)
		
		if (!passwordsMatch) return {error: 'Incorrect password!'}
		
		values.password = await bcrypt.hash(values.newPassword, 10,)
		values.newPassword = undefined
	}
	
	const updatedUser = await db
		.user
		.update({
			where: {id: dbUser.id},
			data: {
				...values,
			}
		})
	
	await unstable_update({
		user: {
			name: updatedUser.name,
			email: updatedUser.email,
			isTwoFactorAuth: updatedUser.isTwoFactorAuth,
			role: updatedUser.role,
		}
	})
	
	return {success: 'Settings Updated!'}
}