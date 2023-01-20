import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		flavors: prisma.flavor.findMany()
	}
}) satisfies PageServerLoad
