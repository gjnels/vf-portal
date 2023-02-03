<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidate } from '$app/navigation'
	import { PageTitle } from '$lib/components'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<PageTitle
	title="Missing SKUs"
	subtitle="SKUs that are missing or incorrect in Lightspeed"
/>

<h3 class="text-xl mb-4 font-bold">SKUs to be Added</h3>
{#if data.missing.length === 0}
	<p class="italic font-light">None found</p>
{:else}
	<ul class="flex flex-col gap-4">
		{#each data.missing as sku (sku.id)}
			<li class="flex gap-4 items-center">
				<form
					method="post"
					use:enhance={async () => {
						return async ({ update }) => {
							await update({ reset: false })
							invalidate('missing-skus')
						}
					}}
				>
					<input
						hidden
						name="id"
						value={sku.id}
					/>
					<input
						hidden
						name="added"
						value={true}
					/>
					<button
						type="submit"
						class="btn btn-sm btn-accent">Mark Complete</button
					>
				</form>
				<p>{sku.sku}</p>
				<p>{sku.item}</p>
			</li>
			<div class="divider m-0" />
		{/each}
	</ul>
{/if}

{#if data.added.length > 0}
	<h3 class="mt-10 mb-4 opacity-75 text-xl font-bold">Added SKUs</h3>
	<ul class="flex flex-col gap-4 opacity-60">
		{#each data.added as sku (sku.id)}
			<li class="flex gap-4 items-center">
				<form
					method="post"
					use:enhance={async () => {
						return async ({ update }) => {
							await update({ reset: false })
							invalidate('missing-skus')
						}
					}}
				>
					<input
						hidden
						name="id"
						value={sku.id}
					/>
					<input
						hidden
						name="added"
						value={false}
					/>
					<button
						type="submit"
						formaction="?/update"
						class="btn btn-sm btn-secondary">Mark Incomplete</button
					>
					<button
						type="submit"
						formaction="?/delete"
						class="btn btn-sm btn-error">Remove</button
					>
				</form>
				<p>{sku.sku}</p>
				<p>{sku.item}</p>
			</li>
			<div class="divider m-0" />
		{/each}
	</ul>
{/if}
