import { Manager } from '$lib/roles'
import { namedBlendSchema } from '$lib/schemas/flavors'
import { prisma } from '$lib/server/prisma'
import { requireUser } from '$lib/server/supabase'
import { validateFormData } from '$lib/utils/forms'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async (event) => {
	return {
		user: (await requireUser(event, { roles: Manager, redirectTo: '/custom-blends' })).user,
		flavors: prisma.flavor.findMany()
	}
}) satisfies PageServerLoad

export const actions = {
	createBlend: async (event) => {
		const { session } = await requireUser(event, { roles: Manager, redirectTo: '/custom-blends' })
		const userId = session.user.id

		const { data, errors } = await validateFormData(event.request, namedBlendSchema)

		if (errors) {
			return fail(400, {
				data,
				errors: errors.fieldErrors
			})
		}

		const blend = await prisma.customBlend.findUnique({
			where: { name: data.name },
			select: { name: true }
		})

		if (blend) {
			return fail(400, {
				data,
				errors: {
					name: ['A blend with this name already exists']
				}
			})
		}

		try {
			const { flavorCount, id, ...rest } = data
			await prisma.customBlend.create({
				data: {
					...rest,
					createdBy: { connect: { id: userId } },
					approvedBy: data.approved ? { connect: { id: userId } } : undefined
				}
			})
		} catch (err) {
			return fail(400, {
				data,
				errors: {
					prisma: ['Error creating blend']
				}
			})
		}

		throw redirect(303, '/custom-blends')
	}
} satisfies Actions
