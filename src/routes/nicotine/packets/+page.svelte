<script lang="ts">
	import { Input, Select, CheckBox } from '$lib/components'
	import type { ActionData, PageData } from './$types'
	import { packets, type Packets } from '$lib/stores/packets'
	import { applyAction, enhance } from '$app/forms'
	import { packetColors } from '$lib/utils/packets'

	export let data: PageData
	export let form: ActionData

	let availablePackets: Packets
	packets.subscribe((value) => {
		availablePackets = data.packets.map((p) => ({
			...p,
			available: value.find((v) => v.id === p.id)?.available ?? true
		}))
	})

	let loading = false
</script>

<div class="grid gap-10 lg:grid-cols-2">
	<div class="flex w-full gap-6">
		<ul>
			<li class="label"><span class="label-text">Available Packets</span></li>
			{#each availablePackets as packet (packet.id)}
				<li>
					<CheckBox
						id={packet.color}
						label="{packet.color} ({packet.level}mg{packet.salt ? ' - salt' : ''})"
						checked={packet.available}
						inputClass="checkbox-accent checkbox-sm"
						onChange={(e) => {
							packets.save(
								availablePackets.map((a) =>
									a.id === packet.id ? { ...a, available: e.currentTarget.checked } : a
								)
							)
						}}
					/>
				</li>
			{/each}
		</ul>
		<form
			class="flex grow flex-col gap-3"
			method="post"
			action="?/calculatePackets"
			use:enhance={async () => {
				loading = true
				return async ({ result }) => {
					await applyAction(result)
					loading = false
				}
			}}
		>
			<input
				hidden
				name="packets"
				value={JSON.stringify(availablePackets)}
			/>

			<Select
				id="bottleSize"
				name="bottleSize"
				label="Bottle Size"
				placeholder="Select the bottle size"
				error={form?.errors?.bottleSize?.[0]}
				options={[
					{
						label: '30 mL',
						value: 30
					},
					{
						label: '50 mL',
						value: 50
					},
					{
						label: '60 mL',
						value: 60
					},
					{
						label: '100 mL',
						value: 100
					},
					{
						label: '120 mL',
						value: 120
					}
				]}
				disabled={loading}
			/>

			<Input
				type="number"
				min="0"
				step="0.1"
				id="initial"
				name="initial"
				label="Current Nicotine Level (mg)"
				error={form?.errors?.initial?.[0]}
				disabled={loading}
			/>

			<Input
				type="number"
				min="0"
				step="0.1"
				id="final"
				name="final"
				label="Final Nicotine Level (mg)"
				error={form?.errors?.final?.[0]}
				disabled={loading}
			/>

			<CheckBox
				id="salt"
				name="salt"
				label="Salt Nicotine"
				inputClass="checkbox-secondary"
				error={form?.errors?.salt?.[0]}
				disabled={loading}
			/>

			<button
				type="submit"
				class="btn-primary btn"
				disabled={loading}
			>
				Calculate
			</button>
		</form>
	</div>

	<div class="flex flex-col items-center">
		<h2 class="text-xl font-semibold">Results</h2>
		<div class="divider m-0" />
		{#if form?.result}
			{#if form.result.length > 0}
				<ul class="flex w-full justify-around gap-10 text-lg">
					{#each form.result as packets}
						<li class="flex flex-col gap-4 text-center">
							{#if packets.type !== 'exact'}
								<p class="capitalize underline underline-offset-2">{packets.type} than desired</p>
							{/if}
							<p>
								Nicotine level: <span class="text-xl font-semibold">{packets.finalNicLevel} mg</span
								>
							</p>
							{#each packets.packets as { color, count }}
								<div
									class="rounded-lg border-4 bg-opacity-10 px-6 py-3 text-center font-semibold text-gray-100 {packetColors[
										color.toLowerCase()
									].background} {packetColors[color.toLowerCase()].border}"
								>
									<p class="capitalize">{color}</p>
									<p>Qty &times; {count}</p>
								</div>
							{/each}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="italic">No valid packets found</p>
			{/if}
		{:else}
			<p class="italic opacity-75">Fill out the form to see the results</p>
		{/if}
	</div>
</div>
