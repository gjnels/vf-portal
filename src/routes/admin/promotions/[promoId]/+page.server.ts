import { promoSchema } from '$lib/schemas/promos'
import { prisma } from '$lib/server/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { error, fail, redirect } from '@sveltejs/kit'
import { ZodError } from 'zod'
import type { Actions, PageServerLoad } from './$types'

const redirectTo = '/admin/promotions'

export const load = (async (event) => {
	const promoId = event.params.promoId
	const promo = await prisma.promo.findUnique({ where: { id: promoId } })
	if (!promo) {
		throw redirect(303, redirectTo)
	}

	return {
		blends: prisma.customBlend.findMany({
			where: {
				OR: [
					{
						promo: null
					},
					{
						promo: {
							id: promoId
						}
					}
				]
			},
			orderBy: { name: 'asc' }
		}),
		promo
	}
}) satisfies PageServerLoad

export const actions = {
	editPromo: async (event) => {
		const user = event.locals.user

		const formData = Object.fromEntries(await event.request.formData())

		try {
			const data = promoSchema.parse(formData)
			await prisma.promo.update({
				where: { id: event.params.promoId },
				data: {
					...data,
					updatedById: user.id
				}
			})
		} catch (err) {
			if (err instanceof ZodError) {
				return fail(400, {
					parseErrors: err.flatten().fieldErrors
				})
			}

			if (err instanceof PrismaClientKnownRequestError) {
				return fail(400, {
					dbError: err
				})
			}

			throw error(500, 'Internal server error. Try again')
		}

		throw redirect(303, redirectTo)
	},

	deletePromo: async ({ params }) => {
		try {
			await prisma.promo.delete({ where: { id: params.promoId } })
		} catch (err) {
			throw fail(400)
		}

		throw redirect(303, redirectTo)
	}
} satisfies Actions
