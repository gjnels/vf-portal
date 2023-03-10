import { z } from 'zod'

// Use for validating nicotine calculator for calculating packets to get to a desired level
export const totalPacketsSchema = z
	.object({
		bottleSize: z.coerce
			.number({ required_error: 'Select a bottle size' })
			.min(1, 'Select a bottle size'),
		initial: z.coerce
			.number({ required_error: 'Enter the current nicotine level' })
			.min(0, 'Initial nicotine level cannot be less than 0'),
		final: z.coerce
			.number({ required_error: 'Enter the nicotine level to get to' })
			.gt(0, 'Final nicotine level must be greater than 0'),
		salt: z.coerce.boolean(),
		packets: z.string() // stringified JSON of available packets
	})
	.superRefine(({ initial, final }, ctx) => {
		if (initial >= final) {
			ctx.addIssue({
				code: 'custom',
				message: 'Final nicotine level must be greater than current nicotine level',
				path: ['final']
			})
		}
	})

export type PacketFormData = Omit<z.infer<typeof totalPacketsSchema>, 'packets'>

// Used for validating nicotine calculator for calculating total nicotine level depending on selected packets to add
export const totalNicotineSchema = z.object({
	bottleSize: z.coerce
		.number({ required_error: 'Select a bottle size' })
		.min(1, 'Select a bottle size'),
	initial: z.coerce
		.number({ required_error: 'Enter the current nicotine level' })
		.min(0, 'Initial nicotine level cannot be less than 0'),
	packets: z.string().min(1, 'Choose at least one packet')
})

export const packetsSchema = z.array(
	z
		.object({
			color: z.string(),
			level: z.number(),
			selected: z.boolean(),
			count: z.coerce.number()
		})
		.superRefine(({ selected, count }, ctx) => {
			if (selected && count < 1) {
				ctx.addIssue({
					code: 'custom',
					message: 'Must be at least 1',
					path: ['count']
				})
			}
		})
)
