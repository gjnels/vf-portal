import { Admin } from '$lib/roles'
import { updateUserSchema } from '$lib/schemas/users'
import { prisma } from '$lib/server/prisma'
import { requireUser, supabaseServerClient } from '$lib/server/supabase'
import { getFormData } from '$lib/utils/forms'
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

		const formData = await getFormData(event.request)

		try {
			const { role, location } = updateUserSchema.parse(formData)
			await prisma.user.update({
				where: { id: event.params.userId },
				data: { role, location: location ? { connect: { id: location } } : { disconnect: true } }
			})
		} catch (err) {
			console.log(err)
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten()
				return fail(400, {
					errors,
					data: { ...formData }
				})
			}
		}

		throw redirect(303, '/admin/users')
	},

	deleteUser: async ({ params }) => {
		// const userId = params.userId
		// try {
		// 	await prisma.user.delete({ where: { id: userId } })
		// 	await supabaseServerClient.auth.admin.deleteUser(userId)
		// } catch (err) {
		// 	console.log(err)
		// 	throw fail(400)
		// }
	}
} satisfies Actions
