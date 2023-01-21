<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { CheckBox, Input, RadioGroup, Select } from '$lib/components'
	import type { FlavorPickerBlendErrors, NamedBlendErrors } from '$lib/schemas/flavors'
	import { categoriesFromFlavors, type SavedBlend } from '$lib/utils/flavors'
	import type { CustomBlend, Flavor, Role } from '@prisma/client'
	import type { ActionResult } from '@sveltejs/kit'

	export let flavors: Flavor[]
	const categories = categoriesFromFlavors(flavors)
	export let userRole: Role | null = null
	export let formAction: string
	export let errors:
		| (NamedBlendErrors & { prisma?: string[] })
		| FlavorPickerBlendErrors
		| undefined = undefined
	export let namedBlend = true
	export let blend: CustomBlend | SavedBlend | null = null
	export let afterSubmit: ((result: ActionResult) => Promise<void>) | undefined = undefined
	export let onCancel: () => void = () => {}

	const isNamedBlend = (blend: CustomBlend | SavedBlend | null): blend is CustomBlend => namedBlend
	const isNamedBlendErrors = (
		errors: (NamedBlendErrors & { prisma?: string[] }) | FlavorPickerBlendErrors | undefined
	): errors is NamedBlendErrors => namedBlend

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

	let flavorCount = blend?.flavor3 ? 3 : blend?.flavor2 ? 2 : 1

	let flavor1 = blend?.flavor1 || ''
	let shots1 = blend?.shots1 || 1

	let flavor2 = blend?.flavor2 || ''
	let shots2 = blend?.shots2 || 1

	let flavor3 = blend?.flavor3 || ''
	let shots3 = 1

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

	let loading = false
	const handleSubmit: SubmitFunction = async () => {
		loading = true
		return async ({ result, update }) => {
			afterSubmit ? await afterSubmit(result) : await update()
			loading = false
		}
	}
</script>

<slot name="blend-details" />

<form
	action={formAction}
	method="post"
	class="flex w-full max-w-lg grow flex-col gap-3"
	use:enhance={handleSubmit}
>
	{#if blend}
		<input
			name="id"
			hidden
			value={blend.id}
		/>
	{/if}

	{#if isNamedBlend(blend)}
		<Input
			id="name"
			name="name"
			label="Blend Name"
			error={isNamedBlendErrors(errors) ? errors?.name?.[0] : ''}
			value={blend?.name}
			disabled={loading}
		/>
	{/if}

	<div class="form-control">
		<label
			for=""
			class="label"
		>
			<span class="label-text -mb-2">Flavor Count</span>
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
			error={errors?.flavorCount?.[0]}
			disabled={loading}
		/>
	</div>

	<Select
		id="flavor1"
		name="flavor1"
		label="Flavor 1"
		groups={categories}
		options={flavor1Options}
		bind:value={flavor1}
		error={errors?.flavor1?.[0]}
		disabled={loading}
		containerClasses="-mb-2"
	/>
	<RadioGroup
		name="shots1"
		bind:group={shots1}
		options={flavorCount === 3 || shots2 === 2
			? shotOptions.SINGLE
			: flavorCount === 2
			? shotOptions.DOUBLE
			: shotOptions.TRIPLE}
		error={errors?.shots1?.[0]}
		disabled={loading}
	/>

	{#if flavorCount >= 2}
		<Select
			id="flavor2"
			name="flavor2"
			label="Flavor 2"
			groups={categories}
			options={flavor2Options}
			bind:value={flavor2}
			error={errors?.flavor2?.[0]}
			disabled={loading}
			containerClasses="-mb-2"
		/>
		<RadioGroup
			name="shots2"
			bind:group={shots2}
			options={flavorCount === 3 || shots1 === 2 ? shotOptions.SINGLE : shotOptions.DOUBLE}
			error={errors?.shots2?.[0]}
			disabled={loading}
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
			error={errors?.flavor3?.[0]}
			disabled={loading}
			containerClasses="-mb-2"
		/>
		<RadioGroup
			name="shots3"
			bind:group={shots3}
			options={shotOptions.SINGLE}
			error={errors?.shots3?.[0]}
			disabled={loading}
		/>
	{/if}

	{#if userRole === 'Admin' && isNamedBlend(blend)}
		<CheckBox
			id="approved"
			name="approved"
			label="Approved"
			checked={blend?.approved ?? true}
			error={isNamedBlendErrors(errors) ? errors?.approved?.[0] : ''}
			disabled={loading}
		/>
	{/if}

	{#if !isNamedBlend(blend)}
		<div class="flex gap-3">
			<Input
				id="nicotine"
				label="Nicotine Level"
				type="number"
				min="0"
				step="0.1"
				disabled={loading}
				value={blend?.nicotine}
				error={!isNamedBlendErrors(errors) ? errors?.nicotine?.[0] : ''}
				containerClass="grow"
			/>
			<Input
				id="bottleCount"
				label="Bottle Count"
				type="number"
				min="0"
				step="0.1"
				disabled={loading}
				value={blend?.bottleCount ?? 1}
				error={!isNamedBlendErrors(errors) ? errors?.bottleCount?.[0] : ''}
				containerClass="grow"
			/>
		</div>
	{/if}

	{#if isNamedBlendErrors(errors) && errors?.prisma?.[0]}
		<span class="text-sm text-error">{errors.prisma[0]}</span>
	{/if}

	{#if isNamedBlend(blend) || !blend}
		<button
			type="submit"
			class="btn btn-primary mt-4"
			disabled={loading}
		>
			{blend ? 'Update' : 'Create'}
		</button>
	{:else}
		<div class="btn-group mt-4 w-full">
			<button
				type="submit"
				class="btn btn-primary grow"
				disabled={loading}
			>
				Update
			</button>
			<button
				type="button"
				class="btn btn-secondary grow"
				disabled={loading}
				on:click={onCancel}
			>
				Cancel
			</button>
		</div>
	{/if}
</form>
