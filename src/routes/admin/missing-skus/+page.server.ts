import { updateMissingSkuSchema } from '$lib/schemas/skus'
import { prisma } from '$lib/server/prisma'
import { validateFormData } from '$lib/utils/forms'
import { fail } from '@sveltejs/kit'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ depends }) => {
	depends('missing-skus')
	return {
		missing: prisma.missingSku.findMany({ where: { added: false } }),
		added: prisma.missingSku.findMany({ where: { added: true } })
	}
}) satisfies PageServerLoad

export const actions = {
	update: async (event) => {
		const { data, errors } = await validateFormData(event.request, updateMissingSkuSchema)

		if (errors) {
			return fail(400)
		}

		if (data.added) {
			await prisma.missingSku.update({
				where: { id: data.id },
				data: {
					added: true,
					addedBy: { connect: { id: event.locals.user.id } },
					addedAt: new Date()
				}
			})
		} else {
			await prisma.missingSku.update({
				where: { id: data.id },
				data: {
					added: false,
					addedBy: { disconnect: true },
					addedAt: null
				}
			})
		}
	},

	delete: async (event) => {
		const { data, errors } = await validateFormData(
			event.request,
			z.object({ id: z.string().cuid() })
		)

		if (errors) {
			return fail(400)
		}

		await prisma.missingSku.delete({ where: { id: data.id } })
	}
} satisfies Actions
