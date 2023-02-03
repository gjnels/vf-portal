import { Admin } from '$lib/roles'
import { prisma } from '$lib/server/prisma'
import { requireUser } from '$lib/server/supabase'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	return {
		user: event.locals.user,
		promos: prisma.promo.findMany({
			include: {
				blend: {
					select: {
						name: true,
						id: true
					}
				},
				createdBy: { select: { id: true, email: true, name: true } },
				updatedBy: { select: { id: true, email: true, name: true } }
			},
			orderBy: [{ validUntil: 'asc' }, { validFrom: 'desc' }]
		})
	}
}) satisfies PageServerLoad
