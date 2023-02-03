import { loginSchema } from '$lib/schemas/users'
import { validateFormData } from '$lib/utils/forms'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { AuthApiError } from '@supabase/supabase-js'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async (event) => {
	const redirectTo = event.url.searchParams.get('redirectTo') ?? '/'
	const { session } = await getSupabase(event)
	if (session) {
		throw redirect(303, redirectTo)
	}
	return {
		redirectTo
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	login: async (event) => {
		const redirectTo = event.url.searchParams.get('redirectTo') ?? '/'
		const { session, supabaseClient } = await getSupabase(event)

		if (session) {
			throw redirect(303, redirectTo)
		}

		const { data, errors } = await validateFormData(event.request, loginSchema)

		if (errors) {
			return fail(400, {
				data: { email: data.email },
				formErrors: errors.fieldErrors
			})
		}

		const { error: err } = await supabaseClient.auth.signInWithPassword(data)

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					data: { email: data.email },
					authError: err.message
				})
			}

			throw error(500, err.message)
		}

		throw redirect(303, redirectTo)
	}
}
