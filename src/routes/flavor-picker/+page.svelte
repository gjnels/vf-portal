<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import { applyAction, enhance, type SubmitFunction } from '$app/forms'
	import { Input, PageTitle, RadioGroup, Select } from '$lib/components'
	import { toastPromise } from '$lib/utils/toast'
	import { createBlendString, categoriesFromFlavors, type SavedBlend } from '$lib/utils/flavors'
	import { blends } from '$lib/stores/blends'
	import { Icon, Pencil, Trash } from 'svelte-hero-icons'

	export let data: PageData
	let { flavors } = data
	let categories = categoriesFromFlavors(flavors)

	export let form: ActionData

	let shotOptions = {
		SINGLE: [{ value: 1, label: 'Single Shot' }],
		DOUBLE: [
			{ value: 1, label: 'Single Shot' },
			{ value: 2, label: 'Double Shot' }
		],
		TRIPLE: [
			{ value: 1, label: 'Single Shot' },
			{ value: 2, label: 'Double Shot' },
			{ value: 3, label: 'Triple Shot' }
		]
	}

	let flavorCount = 1

	let flavor1 = ''
	let shots1 = 1

	let flavor2 = ''
	let shots2 = 1

	let flavor3 = ''
	let shots3 = 1

	let nicotine = 0
	let bottleCount = 1

	$: if (flavorCount === 1) {
		flavor2 = ''
		shots2 = 1
		flavor3 = ''
		shots3 = 1
	} else if (flavorCount === 2) {
		if (shots2 === 2) {
			shots1 = 1
		} else if (shots1 >= 2) {
			shots1 = 2
			shots2 = 1
		}
	} else {
		shots1 = 1
		shots2 = 1
		shots3 = 1
	}

	$: flavor1Options = flavors
		.filter(({ flavor }) => flavor !== flavor2 && flavor !== flavor3)
		.map((f) => ({ value: f.flavor, label: f.flavor, group: f.category }))
	$: flavor2Options = flavors
		.filter(({ flavor }) => flavor !== flavor1 && flavor !== flavor3)
		.map((f) => ({ value: f.flavor, label: f.flavor, group: f.category }))
	$: flavor3Options = flavors
		.filter(({ flavor }) => flavor !== flavor1 && flavor !== flavor2)
		.map((f) => ({ value: f.flavor, label: f.flavor, group: f.category }))

	let editBlendId = ''
	let copyString = ''
	let loading = false

	const copyBlend = (blend: SavedBlend) => {
		const text = createBlendString(blend)
		toastPromise(navigator.clipboard.writeText(text), {
			loading: 'Copying to clipboard...',
			success: () => {
				copyString = ''
				return 'Blend copied to clipboard'
			},
			error: () => {
				copyString = text
				return 'Error copying to clipboard'
			}
		})
	}

	const setEditBlend = (blend: SavedBlend) => {
		editBlendId = blend.id
		flavorCount = blend.flavor3 ? 3 : blend.flavor2 ? 2 : 1
		flavor1 = blend.flavor1
		shots1 = blend.shots1
		flavor2 = blend.flavor2 ?? ''
		shots2 = blend.shots2 ?? 1
		flavor3 = blend.flavor3 ?? ''
		shots3 = blend.shots3 ?? 1
	}

	const resetForm = () => {
		editBlendId = ''
		flavorCount = 1
		flavor1 = ''
		shots1 = 1
		flavor2 = ''
		shots2 = 1
		flavor3 = ''
		shots3 = 1
		nicotine = 0
		bottleCount = 1
	}

	const submitForm: SubmitFunction = async () => {
		loading = true
		return async ({ result }) => {
			await applyAction(result)

			if (result.type === 'success') {
				if (form?.result) {
					const formResult = form.result

					if (editBlendId) {
						blends.updateBlend(formResult)
					} else {
						blends.addBlend(formResult)
					}

					copyBlend(formResult)
				}

				resetForm()
			}
		}
	}
</script>

<PageTitle
	title="Flavor Picker"
	subtitle="Create custom blend flavors for customer transactions"
/>

{#if copyString}
	<p class="mb-6 flex w-fit flex-col gap-2">
		<span class="text-error">Could not copy to your Clipboard. Copy manually:</span>
		<span class="rounded-box border-2 border-info p-4 text-lg">{copyString}</span>
	</p>
{/if}

<div class="grid gap-10 lg:grid-cols-2">
	<form
		action="?/createBlend"
		method="post"
		class="flex w-full grow flex-col gap-3"
		use:enhance={submitForm}
	>
		<input
			hidden
			bind:value={editBlendId}
			name="id"
		/>

		<div class="form-control">
			<label
				for=""
				class="label"
			>
				<span class="label-text">Flavor Count</span>
			</label>
			<RadioGroup
				name="flavorCount"
				bind:group={flavorCount}
				options={[
					{
						value: 1,
						label: '1'
					},
					{
						value: 2,
						label: '2'
					},
					{
						value: 3,
						label: '3'
					}
				]}
				error={form?.errors?.flavorCount?.[0]}
			/>
		</div>

		<Select
			id="flavor1"
			name="flavor1"
			label="Flavor 1"
			groups={categories}
			options={flavor1Options}
			bind:value={flavor1}
			error={form?.errors?.flavor1?.[0]}
		/>

		<RadioGroup
			name="shots1"
			bind:group={shots1}
			options={flavorCount === 3 || shots2 === 2
				? shotOptions.SINGLE
				: flavorCount === 2
				? shotOptions.DOUBLE
				: shotOptions.TRIPLE}
			error={form?.errors?.shots1?.[0]}
		/>

		{#if flavorCount >= 2}
			<Select
				id="flavor2"
				name="flavor2"
				label="Flavor 2"
				groups={categories}
				options={flavor2Options}
				bind:value={flavor2}
				error={form?.errors?.flavor2?.[0]}
			/>
			<RadioGroup
				name="shots2"
				bind:group={shots2}
				options={flavorCount === 3 || shots1 === 2 ? shotOptions.SINGLE : shotOptions.DOUBLE}
				error={form?.errors?.shots2?.[0]}
			/>
		{/if}

		{#if flavorCount === 3}
			<Select
				id="flavor3"
				name="flavor3"
				label="Flavor 3"
				groups={categories}
				options={flavor3Options}
				bind:value={flavor3}
				error={form?.errors?.flavor3?.[0]}
			/>
			<RadioGroup
				name="shots3"
				bind:group={shots3}
				options={shotOptions.SINGLE}
				error={form?.errors?.shots3?.[0]}
			/>
		{/if}

		<div class="grid grid-cols-2 gap-4">
			<Input
				type="number"
				id="nicotine"
				name="nicotine"
				label="Nicotine Level"
				bind:value={nicotine}
				min={0}
				step={0.1}
				error={form?.errors?.nicotine?.[0]}
			/>
			<Input
				type="number"
				id="bottleCount"
				name="bottleCount"
				label="Bottle Count"
				min={1}
				bind:value={bottleCount}
				error={form?.errors?.bottleCount?.[0]}
			/>
		</div>

		{#if editBlendId}
			<div class="btn-group mt-4 w-full">
				<button
					type="submit"
					class="btn btn-primary grow">Update</button
				>
				<button
					type="button"
					class="btn btn-secondary grow"
					on:click={resetForm}>Cancel</button
				>
			</div>
		{:else}
			<button
				type="submit"
				class="btn btn-primary mt-4">Create</button
			>
		{/if}
	</form>

	<div class="grow">
		<div class="flex items-end justify-between">
			<h3 class="text-3xl font-semibold">Created Blends</h3>
			<button
				class="btn btn-secondary"
				on:click={() => blends.clear()}
			>
				Delete All
			</button>
		</div>
		<div class="divider" />
		{#if $blends.length > 0}
			<ul class="flex w-full flex-col">
				{#each $blends as blend (blend.id)}
					<li class="flex flex-wrap items-center gap-4">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<p
							class="btn btn-ghost select-text text-lg normal-case"
							on:click={() => copyBlend(blend)}
						>
							<span class="">{createBlendString(blend)}</span>
						</p>
						<div class="ml-auto shrink-0 space-x-2">
							<button
								class="btn btn-primary btn-square btn-sm"
								on:click={() => setEditBlend(blend)}
							>
								<Icon
									src={Pencil}
									size="1em"
								/>
							</button>
							<button
								class="btn btn-secondary btn-square btn-sm"
								on:click={() => blends.deleteBlend(blend.id)}
							>
								<Icon
									src={Trash}
									size="1em"
								/>
							</button>
						</div>
					</li>
					<div class="divider my-2" />
				{/each}
			</ul>
		{:else}
			<p class="font-light italic">No blends created yet</p>
		{/if}
	</div>
</div>
