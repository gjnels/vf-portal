import { passwordSchema } from '$lib/schemas/users'
import { validateFormData } from '$lib/utils/forms'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async () => {
	return {}
}) satisfies PageServerLoad

export const actions = {
	updatePassword: async (event) => {
		const sb = event.locals.sb
		const { data, errors } = await validateFormData(event.request, passwordSchema)

		if (errors) {
			return fail(400, {
				errors: errors.fieldErrors
			})
		}

		try {
			const { error: err } = await sb.auth.updateUser({ password: data.password })
			if (err) {
				throw err
			}

			// Sign out user to make them sign in with new password
			await sb.auth.signOut()
		} catch (err) {
			return fail(500, { message: 'Failed to update password' })
		}

		throw redirect(303, '/login?redirectTo=/account')
	}
} satisfies Actions
