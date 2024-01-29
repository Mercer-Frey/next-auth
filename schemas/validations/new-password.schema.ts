import * as z from "zod";

export enum ENewPasswordSchema {
	Password = 'password',
}

interface INewPassword {
	[ENewPasswordSchema.Password]: string;
}

export const NewPasswordSchema: z.ZodType<INewPassword> = z.object({
	[ENewPasswordSchema.Password]: z
		.string()
		.min(6, {
			message: "Minimum of 6 characters required",
		}),
});

export type NewPasswordSchemaInfer = z.infer<typeof NewPasswordSchema>;