<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	interface $$Props extends HTMLTextareaAttributes {
		id: string
		label?: string
		error?: string | false
		inputClass?: string
		containerClass?: string
		value?: string
	}

	export let id: string
	export let label = ''
	export let error: string | false | undefined = undefined
	export let inputClass = ''
	export let containerClass = ''
	export let value = ''
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
	<textarea
		class="textarea-bordered textarea {inputClass} {error ? 'textarea-error' : ''}"
		{id}
		bind:value
		{...$$restProps}
	/>
	{#if error}
		<span class="text-error">{error}</span>
	{/if}
</div>
