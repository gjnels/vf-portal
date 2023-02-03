import { Admin } from '$lib/roles'
import { updateUserSchema } from '$lib/schemas/users'
import { prisma } from '$lib/server/prisma'
import { requireUser } from '$lib/server/supabase'
import { validateFormData } from '$lib/utils/forms'
import { fail, redirect } from '@sveltejs/kit'
import { ZodError } from 'zod'
import type { Actions, PageServerLoad } from './$types'

export const load = (async (event) => {
	await requireUser(event, { roles: Admin, redirectTo: '/' })
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
		await requireUser(event, { roles: Admin, redirectTo: '/' })

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
