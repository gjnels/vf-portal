<script lang="ts">
	import { CheckBox, Input, Select } from '$lib/components'
	import type { ActionData, PageData } from './$types'
	import { applyAction, enhance } from '$app/forms'
	import { packetColors } from '$lib/utils/packets'
	import { Icon, Plus } from 'svelte-hero-icons'

	export let data: PageData
	export let form: ActionData

	let loading = false

	const packets = data.packets.map((p) => ({ ...p, selected: false, count: 1 }))
</script>

<div class="flex flex-col-reverse gap-6 lg:flex-row">
	<form
		method="post"
		action="?/calculateLevel"
		class="flex shrink-0 grow flex-col gap-3 lg:max-w-2xl"
		use:enhance={async () => {
			loading = true
			return async ({ result }) => {
				await applyAction(result)
				loading = false
			}
		}}
	>
		<h3 class="font-light">
			Select the nicotine packets and quantities you want to add to a bottle
		</h3>

		<input
			hidden
			name="packets"
			value={JSON.stringify(packets)}
		/>

		<div class="grid gap-x-6 gap-y-3 sm:grid-cols-2">
			{#each packets as packet, index (packet.id)}
				<div class="form-control">
					<span class="label-text label"
						>{packet.color} ({packet.level}mg{packet.salt ? ' - salt' : ''})</span
					>

					<div class="flex items-center gap-2">
						<CheckBox
							id="{packet.color.toLowerCase()}Selected"
							bind:checked={packet.selected}
							disabled={loading}
						/>
						<Input
							type="number"
							id="{packet.color.toLowerCase()}Count"
							min="1"
							bind:value={packet.count}
							disabled={!packet.selected}
							inputClass={packetColors[packet.color.toLowerCase()].border}
							containerClass="grow"
						/>
					</div>
					{#if form?.errors?.[index]}
						<span class="label-text text-error">{form.errors[index]?.[0]}</span>
					{/if}
				</div>
			{/each}
		</div>

		{#if form?.errors?.noPackets?.[0]}
			<span class="text-sm text-error">{form.errors.noPackets[0]}</span>
		{/if}

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

		<button
			type="submit"
			class="btn-primary btn"
			disabled={loading}
		>
			Calculate
		</button>
	</form>

	<div class="divider m-0 lg:hidden" />

	<div class="flex grow flex-col items-center gap-4">
		<h2 class="-mb-2 text-2xl font-semibold">Result</h2>
		<div class="divider m-0" />
		{#if form?.result}
			<p class="text-2xl">
				{form.result.bottleSize}mL starting at {form.result.initial}mg
			</p>
			<ul class="flex flex-wrap justify-center gap-4">
				{#each form.result.packets as { color, count }, index}
					<!-- {#if index > 0}
						<li class="basis-0 self-center">
							<Icon
								src={Plus}
								size="2em"
							/>
						</li>
					{/if} -->
					<li
						class="flex h-20 w-32 flex-col items-center justify-center rounded-lg border-4 bg-opacity-10 font-semibold {packetColors[
							color.toLowerCase()
						].background} {packetColors[color.toLowerCase()].border}"
					>
						<p class="capitalize">{color}</p>
						<p>Qty: {count}</p>
					</li>
				{/each}
			</ul>
			<p class="text-4xl font-semibold">{form.result.level}mg</p>
		{:else}
			<p class="italic opacity-75">Fill out the form to see the results</p>
		{/if}
	</div>
</div>
