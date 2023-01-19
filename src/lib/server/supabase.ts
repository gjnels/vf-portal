import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SERVICE_ROLE_KEY } from '$env/static/private'
import { redirect, type RequestEvent } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { prisma } from './prisma'
import type { Role } from '@prisma/client'
import type { Database } from '$lib/types/database.types'

export const supabaseServerClient = createClient<Database>(PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY)

export const requireUser = async (
	event: RequestEvent,
	options?: { roles: Role[]; redirectTo?: string }
) => {
	const { session, supabaseClient } = await getSupabase(event)

	// A session is required to get the current user from the database
	if (!session) {
		throw redirect(303, `/login?redirectTo=${event.url.pathname}`)
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { role: true, location: { select: { name: true } } }
	})

	// It's possible there is an active session in cookies, but the user has been removed from the database
	// Sign out to remove the 'invalid' session
	if (!user) {
		await supabaseClient.auth.signOut()
		throw redirect(303, '/')
	}

	// Role-based access
	if (options?.roles && !options.roles.includes(user.role)) {
		throw redirect(303, options.redirectTo ?? '/')
	}

	return { user, session, sb: supabaseClient, sbServiceRole: supabaseServerClient }
}
