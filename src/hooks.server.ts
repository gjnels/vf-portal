import '$lib/supabase'
import '$lib/server/supabase'
import type { Handle } from '@sveltejs/kit'
import { requireUser } from '$lib/server/supabase'
import { Admin } from '$lib/roles'

export const handle = (async ({ event, resolve }) => {
	// Account routes requires a logged in user
	if (event.url.pathname.startsWith('/account')) {
		await requireUser(event)
	}

	// Admin routes require Admin role
	if (event.url.pathname.startsWith('/admin')) {
		await requireUser(event, { roles: Admin })
	}

	const response = await resolve(event)

	return response
}) satisfies Handle
