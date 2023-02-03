import { Admin } from '$lib/roles'
import { namedBlendSchema } from '$lib/schemas/flavors'
import { prisma } from '$lib/server/prisma'
import { requireUser } from '$lib/server/supabase'
import { validateFormData } from '$lib/utils/forms'
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async (event) => {
	const { user } = await requireUser(event, { roles: Admin, redirectTo: '/custom-blends' })

	const blend = await prisma.customBlend.findUnique({
		where: { id: event.params.blendId },
		include: {
			approvedBy: { select: { id: true, name: true, email: true } },
			createdBy: { select: { id: true, name: true, email: true } },
			updatedBy: { select: { id: true, name: true, email: true } },
			promo: { select: { id: true, title: true, validFrom: true, validUntil: true } }
		}
	})

	if (!blend) {
		throw redirect(303, '/custom-blends')
	}

	return {
		flavors: prisma.flavor.findMany(),
		user,
		blend
	}
}) satisfies PageServerLoad

export const actions = {
	updateBlend: async (event) => {
		const { session } = await requireUser(event, { roles: Admin, redirectTo: '/custom-blends' })
		const userId = session.user.id

		const { data, errors } = await validateFormData(event.request, namedBlendSchema)

		if (errors) {
			return fail(400, {
				data,
				errors: errors.fieldErrors
			})
		}

		const blend = await prisma.customBlend.findUnique({
			where: { name: data.name },
			select: { id: true, name: true }
		})

		if (blend && blend.id !== data.id) {
			return fail(400, {
				data,
				errors: {
					name: ['A blend with this name already exists']
				}
			})
		}

		try {
			const { flavorCount, id, ...rest } = data
			await prisma.customBlend.update({
				where: {
					id
				},
				data: {
					...rest,
					updatedBy: { connect: { id: userId } },
					approvedBy: data.approved ? { connect: { id: userId } } : { disconnect: true }
				}
			})
		} catch (err) {
			return fail(400, {
				data,
				errors: {
					prisma:
						(err as PrismaClientKnownRequestError).code === 'P2002'
							? ['A blend with these flavors already exists']
							: ['Error creating blend']
				}
			})
		}

		throw redirect(303, '/custom-blends')
	}
} satisfies Actions
