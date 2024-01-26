import * as z from "zod";

export enum ELoginSchema {
	Email = 'email',
	Password = 'password',
}

interface ILogin {
	[ELoginSchema.Email]: string;
	[ELoginSchema.Password]: string;
}

export const LoginSchema: z.ZodType<ILogin> = z.object({
	[ELoginSchema.Email]: z
		.string()
		.email({
			message: "Email is required",
		}),
	[ELoginSchema.Password]: z
		.string()
		.min(1, {
			message: "Password is required",
		}),
});

export type LoginSchemaInfer = z.infer<typeof LoginSchema>;