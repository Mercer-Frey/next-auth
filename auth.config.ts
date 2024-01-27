import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "@/schemas/validations/login.schema";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export default {
	providers: [
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
