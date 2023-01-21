import { profileSchema } from '$lib/schemas/users'
import { prisma } from '$lib/server/prisma'
import { validateFormData } from '$lib/utils/forms'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	return locals.user.role === 'Admin'
		? {
				locations: prisma.location.findMany()
		  }
		: {}
}) satisfies PageServerLoad

export const actions = {
	updateProfile: async (event) => {
		const user = event.locals.user
		const { data, errors } = await validateFormData(event.request, profileSchema)

		if (errors) {
			return {
				data,
				errors: errors.fieldErrors
			}
		}

		console.log(data)

		try {
			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					name: data.name,
					role: data.role,
					location:
						data.location === undefined // do nothing
							? undefined
							: data.location === null // remove location
							? { disconnect: true }
							: { connect: { id: data.location } }
				}
			})
		} catch (err) {
			console.log(err)
			return {
				prismaError: 'Error updating profile',
				data
			}
		}
	}
} satisfies Actions
