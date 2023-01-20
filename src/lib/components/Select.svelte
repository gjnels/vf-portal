<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements'
	interface $$Props extends HTMLSelectAttributes {
		id: string
		label?: string
		error?: string
		groups?: string[]
		options: { label: string; value: string | number; group?: string }[]
		additionalClasses?: string
		containerClasses?: string
		placeholder?: string
	}

	export let id: string
	export let label = ''
	export let error: string | undefined = undefined
	export let groups: string[] | undefined = undefined
	export let options: { label: string; value: string | number; group?: string }[]
	export let additionalClasses = ''
	export let containerClasses = ''
	export let value = ''
	export let placeholder = 'Select an option'
</script>

<div class="form-control {containerClasses}">
	{#if label}
		<label
			for={id}
			class="label"
		>
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<select
		class="select-bordered select {additionalClasses} {error ? 'select-error' : ''}"
		{id}
		name={id}
		bind:value
		{...$$restProps}
	>
		<option value="">{placeholder}</option>
		{#if groups && groups.length > 0}
			{#each groups as group (group)}
				<optgroup label={group}>
					{#each options.filter((o) => o.group === group) as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</optgroup>
			{/each}
		{:else}
			{#each options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		{/if}
	</select>
	{#if error}
		<label
			for={id}
			class="label"
		>
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
