import { browser } from '$app/environment'
import { PUBLIC_LS_PREFIX } from '$env/static/public'
import type { SavedBlend } from '$lib/utils/flavors'
import { writable } from 'svelte/store'

const BLEND_LIMIT = 10
const LS_KEY = PUBLIC_LS_PREFIX + 'blends'

const createBlends = () => {
	const { subscribe, set, update } = writable<SavedBlend[]>([])

	// Can only access localStorage client-side, not server-side
	if (browser) {
		const data = localStorage.getItem(LS_KEY)
		if (data) {
			set(JSON.parse(data))
		}
	}

	return {
		subscribe,
		addBlend: (newBlend: SavedBlend) =>
			update((cur) => {
				const newBlends = [newBlend, ...cur].slice(0, BLEND_LIMIT)
				localStorage.setItem(LS_KEY, JSON.stringify(newBlends))
				return newBlends
			}),
		updateBlend: (updatedBlend: SavedBlend) =>
			update((cur) => {
				const newBlends = cur.map((c) => (c.id === updatedBlend.id ? updatedBlend : c))
				localStorage.setItem(LS_KEY, JSON.stringify(newBlends))
				return newBlends
			}),
		deleteBlend: (blendId: SavedBlend['id']) =>
			update((cur) => {
				const newBlends = cur.filter((c) => c.id !== blendId)
				localStorage.setItem(LS_KEY, JSON.stringify(newBlends))
				return newBlends
			}),
		clear: () => {
			localStorage.removeItem(LS_KEY)
			set([])
		}
	}
}

export const blends = createBlends()
