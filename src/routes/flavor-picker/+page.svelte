<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import { applyAction } from '$app/forms'
	import { PageTitle } from '$lib/components'
	import { toastPromise } from '$lib/utils/toast'
	import { createBlendString, type SavedBlend } from '$lib/utils/flavors'
	import { blends } from '$lib/stores/blends'
	import { Icon, Pencil, Trash } from 'svelte-hero-icons'
	import CustomBlendForm from '$lib/components/CustomBlendForm.svelte'

	export let data: PageData
	let { flavors } = data

	export let form: ActionData

	let copyString = ''

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

	let editBlend: SavedBlend | null = null

	const setEditBlend = (blend: SavedBlend) => {
		editBlend = structuredClone(blend)
	}

	const resetForm = () => {
		console.log('resetting form')
		editBlend = null
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
	{#key editBlend}
		<CustomBlendForm
			{flavors}
			formAction="?/createBlend"
			errors={form?.errors}
			blend={editBlend}
			namedBlend={false}
			onCancel={resetForm}
			afterSubmit={async (result) => {
				await applyAction(result)

				if (result.type === 'success') {
					if (form?.result) {
						const formResult = form.result

						if (editBlend) {
							blends.updateBlend(formResult)
						} else {
							blends.addBlend(formResult)
						}

						copyBlend(formResult)
					}
					resetForm()
				}
			}}
		/>
	{/key}

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
						<button
							class="btn btn-ghost shrink select-text text-lg normal-case"
							on:click={() => copyBlend(blend)}
						>
							{createBlendString(blend)}
						</button>
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
