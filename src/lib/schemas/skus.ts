import { z } from 'zod'

export const missingSkuSchema = z.object({
	sku: z
		.string()
		.min(1, 'Enter the SKU that needs to be added')
		.regex(/[0-9]*/, 'Enter a valid SKU'),
	item: z.string().min(1, 'Enter the item name')
})

export const updateMissingSkuSchema = z.object({
	id: z.string().cuid(),
	added: z.enum(['true', 'false']).transform((v) => v === 'true')
})
