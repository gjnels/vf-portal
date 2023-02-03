import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const getUserCounts = async () => {
		return {
			admin: await prisma.user.count({
				where: { role: 'Admin' }
			}),
			manager: await prisma.user.count({
				where: { role: 'Manager' }
			}),
			store: await prisma.user.count({
				where: { role: 'Store' }
			}),
			user: await prisma.user.count({
				where: { role: 'User' }
			})
		}
	}
	return {
		activePromos: prisma.promo.findMany({
			where: {
				AND: [
					{
						validFrom: { lte: new Date() }
					},
					{
						validUntil: { gte: new Date() }
					}
				]
			}
		}),
		futurePromos: prisma.promo.count({
			where: {
				validFrom: { gt: new Date() }
			}
		}),
		expiredPromos: prisma.promo.count({
			where: {
				validUntil: { lt: new Date() }
			}
		}),
		userCount: getUserCounts(),
		missingSkus: prisma.missingSku.count({ where: { added: false } })
	}
}) satisfies PageServerLoad
