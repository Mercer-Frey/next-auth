import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import { db } from '@/lib/db'
import { getUserById } from '@/data/user'
import 'next-auth'
import { UserRole } from '@prisma/client'
import { EProviders } from '@/types/auth/providers.enum'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { ERouteAuth } from '@/routes'
import { getAccountByUserId } from '@/data/account'

export const {
	handlers: {GET, POST},
	auth,
	signIn,
	signOut,
	unstable_update,
} = NextAuth({
	pages: {
		signIn: ERouteAuth.Login,
		signOut: ERouteAuth.Error,
	},
	events: {
		async linkAccount({user}) {
			await db
				.user
				.update({
					where: {id: user.id},
					data: {emailVerified: new Date()}
				})
		}
	},
	callbacks: {
		async signIn({user, account, profile, email, credentials}) {
			if (account?.provider !== EProviders.Credentials) return true
			
			const existingUser = await getUserById(user.id)
			
			if (!existingUser?.emailVerified) return false
			
			if (existingUser.isTwoFactorAuth) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
				
				if (!twoFactorConfirmation) return false
				
				await db
					.twoFactorConfirmation
					.delete({
						where: {id: twoFactorConfirmation.id}
					})
			}
			
			return true
		},
		async session({token, session}) {
			if (token.sub && session.user) session.user.id = token.sub
			if (token.role && session.user) session.user.role = token.role as UserRole
			
			if (session.user) {
				session.user.name = token.name
				session.user.email = token.email
				session.user.isOAuth = token.isOAuth as boolean
				session.user.isTwoFactorAuth = token.isTwoFactorAuth as boolean
			}
			
			return session
		},
		async jwt({token}) {
			if (!token.sub) return token
			
			const existingUser = await getUserById(token.sub)
			
			if (!existingUser) return token
			
			const existingAccount = await getAccountByUserId(existingUser.id)
			
			token.isOAuth = Boolean(existingAccount)
			token.name = existingUser.name
			token.email = existingUser.email
			token.role = existingUser.role
			token.isTwoFactorAuth = existingUser.isTwoFactorAuth
			
			return token
		}
	},
	adapter: PrismaAdapter(db),
	session: {strategy: 'jwt'},
	...authConfig,
})
