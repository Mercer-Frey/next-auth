import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import "next-auth"
// @ts-ignore
import { UserRole } from "@prisma/client";

// @ts-ignore
export const {
	handlers: {GET, POST},
	auth,
	signIn,
	signOut
} = NextAuth({
	callbacks: {
		async signIn({user, account, profile, email, credentials}) {
			// @ts-ignore
			// const existingUser = await getUserById(user.id);
			
			// if (!existingUser?.emailVerified) return false;
			
			return true
		},
		// async redirect({ url, baseUrl }) {
		// 	return baseUrl
		// },
		async session({token, session}) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			
			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}
			
			return session
		},
		async jwt({token}) {
			if (!token.sub) return token;
			
			const existingUser = await getUserById(token.sub);
			
			if (!existingUser) return token;
			
			token.role = existingUser.role;
			
			return token;
		}
	},
	adapter: PrismaAdapter(db),
	session: {strategy: "jwt"},
	...authConfig,
})