import { prisma } from '$lib/server/prisma'
import { supabaseServerClient } from '$lib/server/supabase'
import { validateFormData } from '$lib/utils/forms'
import { error, fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import type { Actions } from './$types'

export const actions = {
	inviteUser: async (event) => {
		const { data, errors } = await validateFormData(
			event.request,
			z.object({ email: z.string().email() })
		)

		if (errors) {
			return fail(400, {
				parseErrors: errors.fieldErrors
			})
		}

		const { email } = data

		try {
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
					dbError: res.error
				})
			}

			await prisma.user.create({
				data: {
					email,
					id: res.data.user.id
				}
			})
		} catch (err) {
			throw error(500, 'Internal server error. Please try again')
		}

		throw redirect(303, '/admin/users')
	}
} satisfies Actions
