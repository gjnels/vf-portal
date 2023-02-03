import { totalNicotineSchema, packetsSchema } from '$lib/schemas/nicotine'
import { validateFormData } from '$lib/utils/forms'
import { getFinalNicLevel } from '$lib/utils/nicotine'
import { fail } from '@sveltejs/kit'
import type { ZodError } from 'zod'
import type { Actions } from './$types'

export const actions = {
	calculateLevel: async ({ request }) => {
		const { data, errors } = await validateFormData(request, totalNicotineSchema)

		if (errors) {
			return fail(400, {
				data,
				errors: errors.fieldErrors
			})
		}

		const { packets, ...rest } = data

		try {
			const parsedPackets = packetsSchema.parse(JSON.parse(packets))

			const selectedPackets = parsedPackets.filter((p) => p.selected)

			if (selectedPackets.length === 0) {
				return fail(400, {
					...rest,
					errors: {
						noPackets: ['Select at least one nicotine packet to add']
					} as { [x: string]: string[] }
				})
			}

			return {
				result: {
					...rest,
					packets: selectedPackets,
					level: getFinalNicLevel(selectedPackets, rest.bottleSize, rest.initial)
				}
			}
		} catch (err) {
			return fail(400, {
				data: rest,
				errors: (err as ZodError).flatten().fieldErrors
			})
		}
	}
} satisfies Actions
