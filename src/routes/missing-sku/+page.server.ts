import { missingSkuSchema } from '$lib/schemas/skus'
import { prisma } from '$lib/server/prisma'
import { validateFormData } from '$lib/utils/forms'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
	default: async (event) => {
		const { data, errors } = await validateFormData(event.request, missingSkuSchema)

		if (errors) {
			return fail(400, {
				parseErrors: errors.fieldErrors
			})
		}

		if (await prisma.missingSku.findUnique({ where: { sku: data.sku } })) {
			return fail(400, {
				skuError: 'This SKU is already in the missing list'
			})
		}

		await prisma.missingSku.create({
			data
		})
	}
} satisfies Actions
