import { promoSchema } from '$lib/schemas/promos'
import { prisma } from '$lib/server/prisma'
import { requireUser } from '$lib/server/supabase'
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
		const { user } = await requireUser(event)

		const formData = Object.fromEntries(await event.request.formData())

		try {
			const { blendId, ...data } = promoSchema.parse(formData)
			await prisma.promo.create({
				data: {
					...data,
					blend: blendId ? { connect: { id: blendId } } : undefined,
					createdBy: { connect: { id: user.id } }
				}
			})
		} catch (err) {
			console.log(err)
			if (err instanceof ZodError) {
				return fail(400, {
					parseErrors: err.flatten().fieldErrors
				})
			}
			throw error(500, 'Internal server error. Try again')
		}

		throw redirect(303, '/admin/promotions')
	}
} satisfies Actions
