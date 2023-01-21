import '$lib/supabase'
import '$lib/server/supabase'
import type { Handle } from '@sveltejs/kit'
import { requireUser } from '$lib/server/supabase'

export const handle = (async ({ event, resolve }) => {
	// Account routes requires a logged in user
	if (event.url.pathname.startsWith('/account')) {
		await requireUser(event)
	}

	const response = await resolve(event)

	return response
}) satisfies Handle
