import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST = (async (event) => {
	const { supabaseClient } = await getSupabase(event)

	await supabaseClient.auth.signOut()

	throw redirect(303, '/')
}) satisfies RequestHandler
