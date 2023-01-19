import type { RequestEvent } from '@sveltejs/kit'
import type { z, ZodError, ZodTypeAny } from 'zod'

export const validateFormData = async <T extends ZodTypeAny>(
	request: RequestEvent['request'],
	schema: T
): Promise<{
	data: z.infer<T>
	errors: z.inferFlattenedErrors<typeof schema> | null
}> => {
	const formData = Object.fromEntries(await request.formData()) as { [k: string]: string }

	try {
		const data = schema.parse(formData)
		return {
			data,
			errors: null
		}
	} catch (err) {
		const errors = (err as ZodError).flatten()
		return {
			data: formData,
			errors
		}
	}
}
