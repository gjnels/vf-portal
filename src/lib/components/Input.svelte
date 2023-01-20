<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	interface $$Props extends HTMLInputAttributes {
		id: string
		label?: string
		error?: string
		inputClass?: string
		containerClass?: string
		value?: string | number | boolean
	}

	export let id: string
	export let label = ''
	export let error: string | undefined = undefined
	export let inputClass = ''
	export let containerClass = ''
	export let value: string | number | boolean = ''
</script>

<div class="form-control {containerClass}">
	{#if label}
		<label
			for={id}
			class="label"
		>
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<input
		class="input-bordered input {inputClass} {error ? 'input-error' : ''}"
		{id}
		name={id}
		bind:value
		{...$$restProps}
	/>
	{#if error}
		<label
			class="label"
			for={id}
		>
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
