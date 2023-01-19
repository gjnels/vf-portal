import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		promos: prisma.promo.findMany({
			include: { blend: true },
			where: {
				AND: [
					{
						validFrom: {
							lte: new Date()
						}
					},
					{
						validUntil: {
							gte: new Date()
						}
					}
				]
			},
			orderBy: [{ validUntil: 'asc' }, { validFrom: 'desc' }, { title: 'asc' }]
		})
	}
}) satisfies PageServerLoad
