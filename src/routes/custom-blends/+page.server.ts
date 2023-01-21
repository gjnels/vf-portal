import { Admin } from '$lib/roles'
import { prisma } from '$lib/server/prisma'
import { getRole, requireUser } from '$lib/server/supabase'
import { createBlendString } from '$lib/utils/flavors'
import { validateFormData } from '$lib/utils/forms'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { error, fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'

export const load = (async (event) => {
	const role = await getRole(event)
	return {
		blends: prisma.customBlend.findMany({
			where:
				role === 'Admin'
					? undefined
					: {
							approved: true
					  },
			include: {
				promo: {
					select: {
						id: true,
						title: true,
						validFrom: true,
						validUntil: true
					}
				}
			},
			orderBy: [
				{
					promo: { title: 'asc' }
				},
				{ approved: 'asc' },
				{
					name: 'asc'
				}
			]
		})
	}
}) satisfies PageServerLoad

export const actions = {
	copyBlend: async ({ request }) => {
		const { data, errors } = await validateFormData(
			request,
			z.object({
				id: z.string(),
				nicotine: z.coerce.number().min(0, 'Nicotine must be at least 0'),
				bottleCount: z.coerce.number().int().min(1, 'Bottle count must be at least 1')
			})
		)

		const { id, ...rest } = data

		if (errors) {
			return fail(400, {
				id,
				data: rest,
				errors: errors.fieldErrors
			})
		}

		const blend = await prisma.customBlend.findUnique({ where: { id } })

		if (!blend) {
			return fail(400, { message: 'Blend not found', data: rest, id })
		}

		return {
			id,
			result: createBlendString({ ...blend, ...data })
		}
	},

	deleteBlend: async (event) => {
		await requireUser(event, { roles: Admin, redirectTo: '/custom-blends' })

		const { data } = await validateFormData(event.request, z.object({ id: z.string() }))

		try {
			await prisma.customBlend.delete({ where: { id: data.id } })
			console.log('success')
		} catch (err) {
			console.log(err)

			if (err instanceof PrismaClientKnownRequestError) {
				return fail(400, {
					errors: { prisma: [err.message] } as { [x: string]: string[] },
					id: data.id
				})
			}

			throw error(500, 'Internal server error. Try again later.')
		}
	}
} satisfies Actions
