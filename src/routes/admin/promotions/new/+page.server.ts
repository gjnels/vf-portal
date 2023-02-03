import { promoSchema } from '$lib/schemas/promos'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { prisma } from '$lib/server/prisma'
import { validateFormData } from '$lib/utils/forms'
import { error, fail, redirect } from '@sveltejs/kit'
import { ZodError } from 'zod'
import type { Actions, PageServerLoad } from './$types'

export const load = (async (event) => {
	return {
		blends: prisma.customBlend.findMany({ where: { promo: null } })
	}
}) satisfies PageServerLoad

export const actions = {
	editPromo: async (event) => {
		const user = event.locals.user

		const { data, errors } = await validateFormData(event.request, promoSchema)

		if (errors) {
			return fail(400, {
				parseErrors: errors.fieldErrors
			})
		}

		try {
			const { blendId, ...rest } = data
			await prisma.promo.create({
				data: {
					...rest,
					blend: blendId ? { connect: { id: blendId } } : undefined,
					createdBy: { connect: { id: user.id } }
				}
			})
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				return fail(400, {
					dbError: err
				})
			}
			throw error(500, 'Internal server error. Try again')
		}

		throw redirect(303, '/admin/promotions')
	}
} satisfies Actions
