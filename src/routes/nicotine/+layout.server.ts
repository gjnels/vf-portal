import { prisma } from '$lib/server/prisma'
import type { LayoutServerLoad } from './$types'

export const load = (async ({ url }) => {
	return {
		packets: prisma.nicotinePacket.findMany({ orderBy: [{ salt: 'asc' }, { level: 'asc' }] })
	}
}) satisfies LayoutServerLoad
