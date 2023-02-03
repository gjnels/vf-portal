import { z } from 'zod'

export const promoSchema = z.object({
	title: z.string({ required_error: 'Enter a promotion title' }).min(1, 'Enter a promotion title'),
	subtitle: z.string().transform((s) => s || null),
	validFrom: z.coerce.date(),
	validUntil: z.coerce.date(),
	sale: z.string().transform((s) => s || null),
	notes: z.string().transform((s) => s || null),
	blendId: z.string().transform((s) => s || null)
})
