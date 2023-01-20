<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	interface $$Props extends HTMLInputAttributes {
		id: string
		label: string
		error?: string
		inputClass?: string
		containerClass?: string
		checked?: boolean
		onChange?: (
			e: Event & {
				currentTarget: EventTarget & HTMLInputElement
			}
		) => void
	}

	export let id: string
	export let label: string
	export let error: string | undefined = undefined
	export let inputClass = ''
	export let containerClass = ''
	export let checked = false
	export let onChange:
		| ((
				e: Event & {
					currentTarget: EventTarget & HTMLInputElement
				}
		  ) => void)
		| undefined = undefined
</script>

<div class="form-control {containerClass}">
	<label
		for={id}
		class="label"
	>
		<input
			class="checkbox {inputClass} {error ? 'checkbox-error' : ''}"
			{id}
			name={id}
			type="checkbox"
			bind:checked
			on:change={onChange}
			{...$$restProps}
		/>
		<span class="label-text">{label}</span>
	</label>
	{#if error}
		<label
			for={id}
			class="label"
		>
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
