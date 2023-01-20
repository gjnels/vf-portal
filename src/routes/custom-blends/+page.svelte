<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import { applyAction, enhance, type SubmitFunction } from '$app/forms'
	import { Input, PageTitle } from '$lib/components'
	import { Admin, Manager } from '$lib/roles'
	import { toastPromise } from '$lib/utils/toast'
	import { createDisplayBlendString } from '$lib/utils/flavors'
	import toast from 'svelte-french-toast'

	export let data: PageData
	export let form: ActionData

	let blendSearchTerms = ''

	$: blends =
		blendSearchTerms.trim() === ''
			? data.blends
			: data.blends.filter((b) =>
					blendSearchTerms
						.trim()
						.toLowerCase()
						.split(' ')
						.map(
							(term) =>
								b.promo?.title?.toLowerCase()?.includes(term) ||
								b.name.toLowerCase().includes(term) ||
								b.flavor1.toLowerCase().includes(term) ||
								b.flavor2?.toLowerCase().includes(term) ||
								b.flavor3?.toLowerCase().includes(term)
						)
						.every((term) => !!term)
			  )

	let copyString = ''
	let loading = false
</script>

<PageTitle
	title="Custom Blends"
	subtitle="Blends created by customers and employees"
/>

<div class="flex max-w-lg items-end gap-6">
	{#if data.user && Manager.includes(data.user.role)}
		<a
			href="/custom-blends/new"
			class="btn btn-accent">New Blend</a
		>
	{/if}

	<Input
		id="blend-search"
		name="blend-search"
		label="Search for blends"
		type="search"
		bind:value={blendSearchTerms}
		containerClass="max-w-md grow"
	/>
</div>

{#if copyString}
	<p class="mt-6 flex w-fit flex-col gap-2">
		<span class="text-error">Could not copy to your Clipboard. Copy manually:</span>
		<span class="rounded-box border-2 border-info p-4 text-lg">{copyString}</span>
	</p>
{/if}

{#if blends.length === 0}
	{#if blendSearchTerms.trim()}
		<p class="mt-6 italic">No custom blends match your search</p>
	{:else}
		<p class="mt-6 italic">No custom blends found</p>
	{/if}
{:else}
	<ul class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each blends as blend (blend.id)}
			<li class="flex gap-4 rounded-lg">
				<form
					method="post"
					action="?/copyBlend"
					class="collapse-arrow rounded-box collapse grow self-start bg-base-200 ring-inset ring-base-content hover:ring-1"
					use:enhance={async ({ action }) => {
						loading = true

						return async ({ result, update }) => {
							if (
								action.search.includes('copy') &&
								result.type === 'success' &&
								result.data?.id === blend.id
							) {
								const text = result.data.result

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
							} else if (action.search.includes('delete')) {
								switch (result.type) {
									case 'success':
									case 'redirect':
										toast.success('Blend deleted!')
										break
									case 'failure':
										toast.error('Could not delete blend\n' + result.data?.errors?.prisma?.[0])
										break
									default:
										toast.error('Error deleting blend')
								}
							}

							await update()
							loading = false
						}
					}}
				>
					<div class="collapse-title">
						{#if blend.promo && (data.user?.role === 'Admin' || (blend.promo.validFrom <= new Date() && blend.promo.validUntil >= new Date()))}
							<p class="text-lg text-info">Current promotion: {blend.promo.title}</p>
						{/if}

						{#if !blend.approved}
							<p class="text-lg text-error">Not Approved</p>
						{/if}

						<p class="text-xl">{blend.name}</p>
						<p>{createDisplayBlendString(blend)}</p>
					</div>

					<!-- Toggle for collapse menu state -->
					<input type="checkbox" />

					<div class="collapse-content flex max-w-xl flex-col gap-3">
						<input
							hidden
							name="id"
							bind:value={blend.id}
							disabled={loading}
						/>

						<Input
							id="nicotine"
							label="Nicotine Level"
							type="number"
							min="0"
							step="0.1"
							error={form?.id === blend.id ? form?.errors?.nicotine?.[0] : ''}
							disabled={loading}
						/>

						<Input
							id="bottleCount"
							label="Bottle Count"
							type="number"
							min="1"
							error={form?.id === blend.id ? form?.errors?.bottleCount?.[0] : ''}
							disabled={loading}
						/>

						<button
							type="submit"
							class="btn btn-primary"
							disabled={loading}>Copy Blend</button
						>

						{#if data.user && Admin.includes(data.user.role)}
							<div class="mt-6 flex gap-3">
								<a
									class="btn-outline btn btn-accent grow {loading ? 'btn-disabled' : ''}"
									href="/custom-blends/{blend.id}"
								>
									Edit
								</a>

								<button
									class="btn-outline btn btn-secondary grow"
									formaction="?/deleteBlend"
									type="submit"
									disabled={loading}
								>
									Delete
								</button>
							</div>
						{/if}
					</div>
				</form>
			</li>
		{/each}
	</ul>
{/if}
