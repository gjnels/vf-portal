import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	return {
		users: prisma.user.findMany({
			where: { NOT: { id: event.locals.user.id } },
			include: { location: true },
			orderBy: [{ role: 'desc' }, { location: { name: 'asc' } }]
		})
	}
}) satisfies PageServerLoad
