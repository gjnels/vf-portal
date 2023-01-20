import { flavorPickerSchema } from '$lib/schemas/flavors'
import { prisma } from '$lib/server/prisma'
import { validateFormData } from '$lib/utils/forms'
import { fail } from '@sveltejs/kit'
import cuid from 'cuid'
import type { Actions, PageServerLoad } from './$types'

export const load = (async () => {
	return {
		flavors: prisma.flavor.findMany()
	}
}) satisfies PageServerLoad

export const actions = {
	createBlend: async ({ request }) => {
		const { data, errors } = await validateFormData(request, flavorPickerSchema)

		if (errors) {
			return fail(400, {
				data,
				errors: errors.fieldErrors
			})
		}

		return {
			result: { ...data, id: data.id || cuid() }
		}
	}
} satisfies Actions
