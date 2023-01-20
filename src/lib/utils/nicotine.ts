import type { NicotinePacket } from '@prisma/client'
import type { Packets } from '$lib/stores/packets'
import type { PacketFormData } from '../schemas/nicotine'

type FoundPacket = NicotinePacket & { count: number }

export function calculatePackets(formData: PacketFormData, availablePackets: Packets) {
	const { bottleSize, initial, final, salt } = formData

	if (availablePackets == null || !availablePackets.length) return []

	// calculate the total mg of nicotine to be added to bottle
	const currentNic = bottleSize * initial
	const totalNic = bottleSize * final
	const nicAdded = totalNic - currentNic

	// filter available nic packets to have salt nicotine or not
	const packets = availablePackets.filter((packet) => packet.available && packet.salt === salt)

	if (packets == null || !packets.length) return []

	// array of packets to return including exact packets, lower packets, and higher packets
	const returnPackets: {
		packets: FoundPacket[]
		finalNicLevel: number
		type: 'higher' | 'lower' | 'exact'
	}[] = []

	const higherPackets = findPacketsAbove(packets, nicAdded)
	const lowerPackets = findPacketsBelow(packets, nicAdded)

	if (lowerPackets.length) {
		const nicLevel = getFinalNicLevel(lowerPackets, bottleSize, initial)
		if (nicLevel === final) {
			returnPackets.push({
				type: 'exact',
				finalNicLevel: getFinalNicLevel(lowerPackets, bottleSize, initial),
				packets: lowerPackets
			})
			return returnPackets
		}

		returnPackets.push({
			type: 'lower',
			finalNicLevel: getFinalNicLevel(lowerPackets, bottleSize, initial),
			packets: lowerPackets
		})
	}

	if (higherPackets.length) {
		returnPackets.push({
			type: 'higher',
			finalNicLevel: getFinalNicLevel(higherPackets, bottleSize, initial),
			packets: higherPackets
		})
	}

	return returnPackets
}

// find all packets needed to get the nicotine level as close to the desired level as possible without going over
function findPacketsBelow(packets: Packets, nicToAdd: number) {
	const lowerPackets: FoundPacket[] = []
	let currentNic = nicToAdd
	while (currentNic > 0) {
		const lower = findLowerPacket(packets, currentNic)
		currentNic -= lower?.level ?? currentNic
		const addedPacket = lowerPackets.find((packet) => packet.id === lower?.id)
		if (addedPacket) {
			addedPacket.count += 1
		} else if (lower) {
			lowerPackets.push({ count: 1, ...lower })
		}
	}
	return lowerPackets
}

function findPacketsAbove(packets: Packets, nicToAdd: number) {
	const higherPackets: FoundPacket[] = []
	let currentNic = nicToAdd

	while (currentNic > 0) {
		const lower = findLowerPacket(packets, currentNic)
		const higher = findHigherPacket(packets, currentNic)

		if (lower) {
			currentNic -= lower.level

			const addedPacket = higherPackets.find((packet) => packet.id === lower.id)

			if (addedPacket) {
				addedPacket.count += 1
			} else {
				higherPackets.push({ count: 1, ...lower })
			}
		} else if (higher) {
			currentNic -= higher.level

			const addedPacket = higherPackets.find((packet) => packet.id === higher.id)

			if (addedPacket) {
				addedPacket.count += 1
			} else {
				higherPackets.push({ count: 1, ...higher })
			}
		}
	}

	return filterPackets(higherPackets, packets)
}

// Get the most accurate count of packets without duplicates or packets that could be combined into another packet
function filterPackets(packets: FoundPacket[], allPackets: Packets): FoundPacket[] {
	const { packets: filteredDuplicatePackets, found: foundDuplicates } = findDuplicatePackets(
		packets,
		allPackets
	)

	const { packets: filteredAdditivePackets, found: foundAdditive } = findAdditivePackets(
		filteredDuplicatePackets,
		allPackets
	)

	// Adjustments were found, so run again until there are no adjustments left to make
	if (foundDuplicates || foundAdditive) {
		return filterPackets(filteredAdditivePackets, allPackets)
	}

	return filteredAdditivePackets
}

// Filter the results to look for packets that have multiple counts that can be combined to a equal a packet of a higher nicotine level
// e.g. if there are 2 blue packets (180mg) and purple packets (360mg) are available, remove the 2 blue packets and add one purple packet
function findDuplicatePackets(currentPackets: FoundPacket[], allPackets: Packets) {
	const packets: FoundPacket[] = []
	let found = false
	currentPackets.forEach((packet) => {
		const betterPacket = allPackets.find(
			(p) => p.level === packet.level * packet.count && p.id !== packet.id
		)

		const foundPacketIndex = packets.findIndex((packet) => packet.id === betterPacket?.id)

		if (foundPacketIndex >= 0) {
			packets[foundPacketIndex].count += 1
			found = true
		} else if (betterPacket) {
			packets.push({ count: 1, ...betterPacket })
			found = true
		} else {
			packets.push({ ...packet })
		}
	})
	return { packets, found }
}

// Filter packets to find packets that can be added together to make a higher packet
// e.g. if there is a blue packet (180mg) and a purple packet (360mg) and brown packets (540mg) are available, remove the blue and purple and add a brown
function findAdditivePackets(currentPackets: FoundPacket[], allPackets: Packets) {
	let found = false
	const packets = [...currentPackets]

	for (let i = 0; i < packets.length; i++) {
		for (let j = i + 1; j < packets.length; j++) {
			const foundPacket = allPackets.find((p) => p.level === packets[i].level + packets[j].level)

			if (foundPacket) {
				const packetInResultIndex = packets.findIndex((p) => p.id === foundPacket.id)
				if (packetInResultIndex >= 0) {
					packets[packetInResultIndex].count++
					packets.splice(j, 1)
					packets.splice(i, 1)
				} else {
					packets[i] = { ...foundPacket, count: 1 }
					packets.splice(j, 1)
				}
				found = true
			}
		}
	}

	return { packets, found }
}

// find the packet that is closest to the current nicotine level to be added without being less than that nicotine level
function findHigherPacket(packets: Packets, nicToAdd: number) {
	return packets.reduce<NicotinePacket | null>((closestPacket, currentPacket) => {
		if (currentPacket.level < nicToAdd) {
			return closestPacket
		}

		if (closestPacket && currentPacket.level > closestPacket.level) {
			return closestPacket
		}

		return currentPacket
	}, null)
}

// find the packet that is closest to the current nicotine level to be added without being more than that nicotine level
function findLowerPacket(packets: Packets, nicToAdd: number) {
	return packets.reduce<NicotinePacket | null>((closestPacket, currentPacket) => {
		if (currentPacket.level > nicToAdd) {
			return closestPacket
		}

		if (closestPacket && currentPacket.level < closestPacket.level) {
			return closestPacket
		}

		return currentPacket
	}, null)
}

// calculate the final nicotine level of the bottle based on all packets being added, the bottle size, and the initial nicotine level of the bottle
export function getFinalNicLevel(
	packets: { level: number; count: number }[],
	bottleSize: number,
	initialLevel: number
) {
	return (
		initialLevel +
		parseFloat(
			(
				packets.reduce((nic, packet) => {
					const addedNic = packet.level * packet.count
					return nic + addedNic
				}, 0) / bottleSize
			).toFixed(1)
		)
	)
}
