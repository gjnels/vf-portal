import { PrismaClient } from '@prisma/client'
import { CONNECTION_POOL_URL } from '$env/static/private'

let prisma: PrismaClient

declare global {
	var __prisma__: PrismaClient
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient({
		datasources: {
			db: {
				url: CONNECTION_POOL_URL
			}
		}
	})
} else {
	if (!global.__prisma__) {
		global.__prisma__ = new PrismaClient({
			datasources: {
				db: {
					url: CONNECTION_POOL_URL
				}
			}
		})
	}
	prisma = global.__prisma__
	prisma.$connect()
}

export { prisma }
