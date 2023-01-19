import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event)

	if (session) {
		const { error: err } = await supabaseClient.auth.signOut()
		if (err) {
			throw error(500, 'Logout failed')
		}
	}

	throw redirect(303, '/')
}) satisfies RequestHandler
