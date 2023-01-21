import { z } from 'zod'

export const flavorSchema = z
	.discriminatedUnion('flavorCount', [
		z.object({
			flavorCount: z.literal('1').transform((n) => Number(n)),
			flavor1: z.string({ required_error: 'Select a flavor' }).min(1, 'Select a flavor'),
			shots1: z.coerce
				.number({ required_error: 'Select number of shots' })
				.min(1, 'Shots cannot be less than 1')
				.max(3, 'Shots cannot be more than 3'),
			flavor2: z
				.string()
				.optional()
				.transform(() => null),
			shots2: z
				.string()
				.optional()
				.transform(() => null),
			flavor3: z
				.string()
				.optional()
				.transform(() => null),
			shots3: z
				.string()
				.optional()
				.transform(() => null)
		}),
		z.object({
			flavorCount: z.literal('2').transform((n) => Number(n)),
			flavor1: z.string({ required_error: 'Select a flavor' }).min(1, 'Select a flavor'),
			shots1: z.coerce
				.number({ required_error: 'Select number of shots' })
				.min(1, 'Shots cannot be less than 1')
				.max(2, 'Shots cannot be more than 2'),
			flavor2: z.string({ required_error: 'Select a flavor' }).min(1, 'Select a flavor'),
			shots2: z.coerce
				.number({ required_error: 'Select number of shots' })
				.min(1, 'Shots cannot be less than 1')
				.max(2, 'Shots cannot be more than 2'),
			flavor3: z
				.string()
				.optional()
				.transform(() => null),
			shots3: z
				.string()
				.optional()
				.transform(() => null)
		}),
		z.object({
			flavorCount: z.literal('3').transform((n) => Number(n)),
			flavor1: z.string({ required_error: 'Select a flavor' }).min(1, 'Select a flavor'),
			shots1: z.coerce
				.number({ required_error: 'Select number of shots' })
				.min(1, 'Single shots only for 3 flavors')
				.max(1, 'Single shots only for 3 flavors'),
			flavor2: z.string({ required_error: 'Select a flavor' }).min(1, 'Select a flavor'),
			shots2: z.coerce
				.number({ required_error: 'Select number of shots' })
				.min(1, 'Single shots only for 3 flavors')
				.max(1, 'Single shots only for 3 flavors'),
			flavor3: z.string({ required_error: 'Select a flavor' }).min(1, 'Select a flavor'),
			shots3: z.coerce
				.number({ required_error: 'Select number of shots' })
				.min(1, 'Single shots only for 3 flavors')
				.max(1, 'Single shots only for 3 flavors')
		})
	])
	.superRefine(({ flavorCount, flavor1, flavor2, flavor3, shots1, shots2 }, ctx) => {
		if (flavorCount === 2) {
			if (flavor1 === flavor2) {
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor1']
				})
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor2']
				})
			}
			if (shots1 === 2 && shots2 === 2) {
				ctx.addIssue({
					code: 'custom',
					message: 'Total shots cannot be more than 3',
					path: ['shots1']
				})
				ctx.addIssue({
					code: 'custom',
					message: 'Total shots cannot be more than 3',
					path: ['shots2']
				})
			}
		}

		if (flavorCount === 3) {
			if (flavor1 === flavor2) {
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor1']
				})
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor2']
				})
			}
			if (flavor1 === flavor3) {
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor1']
				})
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor3']
				})
			}
			if (flavor2 === flavor3) {
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor2']
				})
				ctx.addIssue({
					code: 'custom',
					message: 'Cannot choose the same flavor more than once',
					path: ['flavor3']
				})
			}
		}
	})

export type Flavors = Omit<z.infer<typeof flavorSchema>, 'flavorCount'>

export const namedBlendSchema = z
	.object({
		id: z.string().optional(),
		name: z.string({ required_error: 'Enter a blend name' }).min(1, 'Enter a blend name'),
		approved: z.coerce.boolean({ required_error: 'Approve or disapprove the blend' }).default(false)
	})
	.and(flavorSchema)

export type NamedBlend = z.infer<typeof namedBlendSchema>
export type NamedBlendErrors = z.inferFlattenedErrors<typeof namedBlendSchema>['fieldErrors']

export const flavorPickerSchema = z
	.object({
		id: z.string().optional(),
		bottleCount: z.coerce
			.number({ required_error: 'Enter number of bottles' })
			.int()
			.min(1, 'Must be at least 1'),
		nicotine: z.coerce
			.number({ required_error: 'Enter nicotine level' })
			.min(0, 'Must be greater than or equal to 0')
	})
	.and(flavorSchema)
