<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	interface $$Props extends HTMLInputAttributes {
		group: string | number
		options: { value: string | number; label: string }[]
		error?: string
	}

	export let error: string | undefined = undefined
	export let options: { value: string | number; label: string }[]
	export let group: string | number
</script>

<div class="form-control">
	<div class="flex gap-3">
		{#each options as option (option.label)}
			<label class="label cursor-pointer gap-1">
				<input
					type="radio"
					value={option.value}
					bind:group
					class="radio {error ? 'radio-error' : ''}"
					{...$$restProps}
				/>
				<span class="label-text ml-1">{option.label}</span>
			</label>
		{/each}
	</div>
	{#if error}
		<label
			for=""
			class="label"
		>
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
