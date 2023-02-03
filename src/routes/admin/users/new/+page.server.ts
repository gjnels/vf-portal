import { Admin } from '$lib/roles'
import { prisma } from '$lib/server/prisma'
import { requireUser, supabaseServerClient } from '$lib/server/supabase'
import { error, fail, redirect } from '@sveltejs/kit'
import { z, ZodError } from 'zod'
import type { Actions } from './$types'

export const actions = {
	inviteUser: async (event) => {
		await requireUser(event, { roles: Admin, redirectTo: '/' })

		const formData = await event.request.formData()

		try {
			const { email } = z.object({ email: z.string().email() }).parse(formData)
			const user = await prisma.user.findUnique({ where: { email } })
			if (user) {
				return fail(400, {
					errors: {
						email: ['User with this email already exists']
					},
					data: {
						email
					}
				})
			}

			const res = await supabaseServerClient.auth.admin.inviteUserByEmail(email, {
				redirectTo: event.url.origin + '/account/security'
			})

			if (res.error) {
				return fail(400, {
					sbError: { ...res.error }
				})
			}

			await prisma.user.create({
				data: {
					email,
					id: res.data.user.id
				}
			})
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten()
				return fail(400, {
					errors
				})
			}

			throw error(500, 'Internal server error. Please try again')
		}

		throw redirect(303, '/admin/users')
	}
} satisfies Actions
