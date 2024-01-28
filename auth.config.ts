import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "@/schemas/validations/login.schema";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Github({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);
				
				if (validatedFields.success) {
					const {email, password} = validatedFields.data;
					const user = await getUserByEmail(email);
					
					if (!user || !user.password) return null;
					
					const passwordsMatch = await bcrypt.compare(password, user.password,);
					
					if (passwordsMatch) return user;
				}
				
				return null;
			}
		})
	],
} satisfies NextAuthConfig

