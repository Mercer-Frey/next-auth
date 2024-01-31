import * as z from 'zod'
import { UserRole } from '@prisma/client'

export enum ESettingsSchema {
	Name = 'name',
	IsTwoFactorAuth = 'isTwoFactorAuth',
	Role = 'role',
	Email = 'email',
	Password = 'password',
	NewPassword = 'newPassword',
}

interface ISettings {
	[ESettingsSchema.Name]?: string;
	[ESettingsSchema.IsTwoFactorAuth]?: boolean;
	[ESettingsSchema.Role]: UserRole;
	[ESettingsSchema.Email]?: string;
	[ESettingsSchema.Password]?: string;
	[ESettingsSchema.NewPassword]?: string;
}

export const SettingsSchema: z.ZodType<ISettings> = z.object({
	[ESettingsSchema.Name]: z
		.optional(z.string()),
	[ESettingsSchema.IsTwoFactorAuth]: z
		.optional(z.boolean()),
	[ESettingsSchema.Role]: z
		.enum([UserRole.ADMIN, UserRole.USER]),
	[ESettingsSchema.Email]: z
		.optional(z
			.string()
			.email()
		),
	[ESettingsSchema.Password]: z
		.optional(z
			.string()
			.min(6)
		),
	[ESettingsSchema.NewPassword]: z
		.optional(z
			.string()
			.min(6)
		),
})
	.refine((data) =>
			!(data.password && !data.newPassword),
		{
			message: 'New password is required!',
			path: ['newPassword']
		}
	)
	.refine((data) =>
			!(data.newPassword && !data.password),
		{
			message: 'Password is required!',
			path: ['password']
		}
	)

export type SettingsSchemaInfer = z.infer<typeof SettingsSchema>;