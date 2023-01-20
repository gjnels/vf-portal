import { totalPacketsSchema } from '$lib/schemas/nicotine'
import type { Packets } from '$lib/stores/packets'
import { validateFormData } from '$lib/utils/forms'
import { calculatePackets } from '$lib/utils/nicotine'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	calculatePackets: async ({ request }) => {
		const { data, errors } = await validateFormData(request, totalPacketsSchema)

		if (errors) {
			return fail(400, {
				data,
				errors: errors.fieldErrors
			})
		}

		const { packets, ...rest } = data
		const parsedPackets: Packets = JSON.parse(packets)

		return {
			result: calculatePackets(rest, parsedPackets)
		}
	}
}
