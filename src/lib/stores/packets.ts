import { browser } from '$app/environment'
import { PUBLIC_LS_PREFIX } from '$env/static/public'
import type { NicotinePacket } from '@prisma/client'
import { writable } from 'svelte/store'

const LS_KEY = PUBLIC_LS_PREFIX + 'packets'

export type Packets = Array<NicotinePacket & { available: boolean }>

const createPackets = () => {
	const { subscribe, set } = writable<Packets>([])

	// Can only access localStorage client-side, not server-side
	if (browser) {
		const data = localStorage.getItem(LS_KEY)
		if (data) {
			set(JSON.parse(data))
		}
	}

	return {
		subscribe,
		save: (packets: Packets) => {
			localStorage.setItem(LS_KEY, JSON.stringify(packets))
			set(packets)
		},
		clear: () => {
			localStorage.removeItem(LS_KEY)
			set([])
		}
	}
}

export const packets = createPackets()
