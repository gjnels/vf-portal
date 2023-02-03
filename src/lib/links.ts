import {
	Beaker,
	Calculator,
	Calendar,
	ClipboardList,
	ColorSwatch,
	UserGroup,
	ViewBoards,
	type IconSource
} from 'svelte-hero-icons'

export type Link = {
	href: string
	activeHref?: string
	label: string
	icon: IconSource
	children?: undefined
}

export const links: Link[] = [
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
		activeHref: '/nicotine',
		label: 'Nicotine Calculator',
		icon: Calculator
	}
]

export const storeLinks: Link[] = []

export const managerLinks: Link[] = []

export const adminLinks: Link[] = [
	{
		href: '/admin',
		label: 'Admin Dashboard',
		icon: ViewBoards
	},
	{
		href: '/admin/promotions',
		activeHref: '/admin/promotions',
		label: 'Promotions',
		icon: Calendar
	},
	{
		href: '/admin/users',
		activeHref: '/admin/users',
		label: 'Users',
		icon: UserGroup
	},
	{
		href: '/admin/missing-skus',
		label: 'Missing SKUs',
		icon: ClipboardList
	}
]
