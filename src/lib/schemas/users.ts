import { Role } from '@prisma/client'
import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.min(1, { message: 'Email is required' })
		.email({ message: 'Invalid email address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(1, { message: 'Password is required' })
		.trim()
})

export const profileSchema = z.object({
	name: z
		.string()
		.transform((x) => x || null)
		.nullable(),
	role: z.nativeEnum(Role).optional(),
	location: z
		.string()
		.nullish()
		.transform((l) => (l === '' ? null : l))
})

export const passwordSchema = z
	.object({
		password: z
			.string({ required_error: 'Enter your new password' })
			.min(8, { message: 'Password must be 8 or more characters' })
			.max(64),
		passwordConfirm: z.string({ required_error: 'Confirm your new password' })
	})
	.superRefine(({ password, passwordConfirm }, ctx) => {
		if (password !== passwordConfirm) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords must match',
				path: ['password']
			})
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords must match',
				path: ['passwordConfirm']
			})
		}
	})
