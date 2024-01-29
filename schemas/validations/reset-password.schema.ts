import * as z from "zod";

export enum EResetPasswordSchema {
	Email = 'email',
}

interface IResetPassword {
	[EResetPasswordSchema.Email]: string;
}

export const ResetPasswordSchema: z.ZodType<IResetPassword> = z.object({
	[EResetPasswordSchema.Email]: z
		.string()
		.email({
			message: "Email is required",
		}),
});

export type ResetPasswordSchemaInfer = z.infer<typeof ResetPasswordSchema>;