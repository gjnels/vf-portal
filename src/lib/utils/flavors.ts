import type { CustomBlend, Flavor } from '@prisma/client'

export const categoriesFromFlavors = (flavors: Flavor[]) =>
	Array.from(new Set(flavors.map((flavor) => flavor.category)))

export type BlendFlavors = Pick<
	CustomBlend,
	'flavor1' | 'flavor2' | 'flavor3' | 'shots1' | 'shots2' | 'shots3'
>

export type CopyBlend = BlendFlavors & { name?: string; nicotine: number; bottleCount: number }

export type SavedBlend = CopyBlend & { id: string }

const blendFlavorsToArray = (data: BlendFlavors) => {
	const blend = [{ flavor: data.flavor1, shots: data.shots1 }]
	if (data.flavor2 && data.shots2) {
		blend.push({ flavor: data.flavor2, shots: data.shots2 })
	}
	if (data.flavor3 && data.shots3) {
		blend.push({ flavor: data.flavor3, shots: data.shots3 })
	}
	return blend
}

export const createBlendString = (mix: CopyBlend) => {
	return mix
		? `${mix.bottleCount} x ${mix.nicotine}mg ${
				mix.name ? `${mix.name} ` : ''
		  }(${blendFlavorsToArray(mix)
				.map(({ flavor, shots }) => `${shots} ${flavor}`)
				.join(' - ')})`
		: ''
}

export const createDisplayBlendString = (blend: BlendFlavors) => {
	return blendFlavorsToArray(blend)
		.map(({ flavor, shots }) => `${shots} ${flavor}`)
		.join(' - ')
}
