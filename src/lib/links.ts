import { Beaker, Calculator, ColorSwatch, type IconSource } from 'svelte-hero-icons'

export type Link = {
	href: string
	label: string
	icon: IconSource
	children?: undefined
}

export type LinkWithChildren = { href: string; children: Link[] }

export type Links = Array<Link | LinkWithChildren>

export const links: Links = [
	{
		href: '/flavor-picker',
		label: 'Flavor Picker',
		icon: Beaker
	},
	{
		href: '/custom-blends',
		label: 'Custom Blends',
		icon: ColorSwatch
	},
	{
		href: '/nicotine',
		label: 'Nicotine Calculator',
		icon: Calculator
	}
]

export const storeLinks: Links = []

export const managerLinks: Links = []

export const adminLinks: Links = []
