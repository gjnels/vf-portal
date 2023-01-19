import { prisma } from '$lib/server/prisma'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event)

	const user = session
		? await prisma.user.findUnique({
				where: { id: session.user.id },
				select: { role: true, name: true, email: true }
		  })
		: null

	if (session && !user) {
		await supabaseClient.auth.signOut()
		throw redirect(303, '/')
	}

	return {
		user
	}
}) satisfies LayoutServerLoad
