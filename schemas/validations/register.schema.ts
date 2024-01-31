import * as z from 'zod'

export enum ERegisterSchema {
	Name = 'name',
	Email = 'email',
	Password = 'password',
}

interface IRegister {
	[ERegisterSchema.Name]: string;
	[ERegisterSchema.Email]: string;
	[ERegisterSchema.Password]: string;
}

export const RegisterSchema: z.ZodType<IRegister> = z.object({
	[ERegisterSchema.Name]: z
		.string()
		.min(1, {
			message: 'Name is required',
		}),
	[ERegisterSchema.Email]: z
		.string()
		.email({
			message: 'Email is required',
		}),
	[ERegisterSchema.Password]: z
		.string()
		.min(6, {
			message: 'Minimum 6 characters is required',
		}),
})

export type RegisterSchemaInfer = z.infer<typeof RegisterSchema>;
