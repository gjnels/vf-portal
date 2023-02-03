import { updateUserSchema } from '$lib/schemas/users'
import { prisma } from '$lib/server/prisma'
import { validateFormData } from '$lib/utils/forms'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async (event) => {
	const userId = event.params.userId
	const user = await prisma.user.findUnique({ where: { id: userId } })
	if (!user) {
		throw redirect(303, '/admin/users')
	}
	return {
		user,
		locations: prisma.location.findMany()
	}
}) satisfies PageServerLoad

export const actions = {
	updateUser: async (event) => {
		const { data, errors } = await validateFormData(event.request, updateUserSchema)

		if (errors) {
			return fail(400, {
				parseErrors: errors.fieldErrors
			})
		}

		await prisma.user.update({
			where: { id: event.params.userId },
			data: {
				role: data.role,
				location: data.location ? { connect: { id: data.location } } : { disconnect: true }
			}
		})

		throw redirect(303, '/admin/users')
	}
} satisfies Actions
