import { Admin } from '$lib/roles'
import { prisma } from '$lib/server/prisma'
import { requireUser } from '$lib/server/supabase'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const { user } = await requireUser(event, { roles: Admin, redirectTo: '/' })

	return {
		users: prisma.user.findMany({
			where: { NOT: { id: user.id } },
			include: { location: true },
			orderBy: [{ role: 'desc' }, { location: { name: 'asc' } }]
		})
	}
}) satisfies PageServerLoad
