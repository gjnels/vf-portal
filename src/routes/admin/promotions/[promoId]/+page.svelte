<script lang="ts">
	import { enhance } from '$app/forms'
	import { Input, PageTitle, Select, TextArea } from '$lib/components'
	import { formatDateInput } from '$lib/utils/dates'
	import toast from 'svelte-french-toast'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	let { promo, blends } = data

	export let form: ActionData

	let loading = false
</script>

<PageTitle title="Edit Promotion" />

<form
	method="post"
	action="?/editPromo"
	class="flex max-w-xl flex-col gap-3"
	use:enhance={async () => {
		loading = true
		return async ({ result, update }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				toast.success('Promotion updated')
			}
			await update()
			loading = false
		}
	}}
>
	<label
		for="delete-modal"
		class="btn-secondary btn mb-2"
	>
		Delete Promo
	</label>

	<input
		hidden
		name="id"
		value={promo.id}
	/>

	<Input
		id="title"
		label="Title"
		value={promo.title}
		required
		error={form?.parseErrors?.title?.[0]}
		disabled={loading}
	/>

	<Input
		id="subtitle"
		name="subtitle"
		label="Subtitle (brand, category, etc.)"
		value={promo.subtitle ?? ''}
		error={form?.parseErrors?.subtitle?.[0]}
		disabled={loading}
	/>

	<Select
		id="blendId"
		label="Custom Blend"
		placeholder="None"
		options={blends.map((b) => ({ value: b.id, label: b.name }))}
		value={promo.blendId ?? ''}
		error={form?.parseErrors?.blendId?.[0]}
		disabled={loading}
	/>

	<Input
		id="validFrom"
		name="validFrom"
		label="Active Beginning This Day"
		type="datetime-local"
		inputClass="cursor-pointer"
		value={formatDateInput(promo.validFrom)}
		error={form?.parseErrors?.validFrom?.[0]}
		disabled={loading}
	/>

	<Input
		id="validUntil"
		name="validUntil"
		label="Active Until This Day"
		type="datetime-local"
		inputClass="cursor-pointer"
		value={formatDateInput(promo.validUntil)}
		error={form?.parseErrors?.validUntil?.[0]}
		disabled={loading}
	/>

	<TextArea
		id="sale"
		name="sale"
		label="Sale"
		rows={3}
		value={promo.sale ?? ''}
		error={form?.parseErrors?.sale?.[0]}
		disabled={loading}
	/>

	<TextArea
		id="notes"
		name="notes"
		label="Notes"
		rows={3}
		value={promo.notes ?? ''}
		error={form?.parseErrors?.notes?.[0]}
		disabled={loading}
	/>

	<button
		type="submit"
		class="btn-primary btn"
		disabled={loading}
	>
		Update
	</button>
</form>

<input
	type="checkbox"
	id="delete-modal"
	class="modal-toggle"
/>
<label
	for="delete-modal"
	class="modal cursor-pointer"
>
	<label
		class="modal-bottom modal-box sm:border sm:border-base-content sm:modal-middle"
		for=""
	>
		<p>Are you sure you want to delete this promotion?</p>
		<form
			class="modal-action"
			method="post"
			action="?/deletePromo"
			use:enhance={async () => {
				return async ({ result, update }) => {
					if (result.type === 'success' || result.type === 'redirect') {
						toast.success('Promotion deleted')
					} else {
						toast.error('Could not delete promotion')
					}
					await update()
				}
			}}
		>
			<input
				hidden
				bind:value={data.promo.id}
				name="id"
			/>
			<button
				type="submit"
				class="btn-primary btn"
			>
				Yes
			</button>
			<label
				class="btn-secondary btn"
				for="delete-modal"
			>
				No
			</label>
		</form>
	</label>
</label>
