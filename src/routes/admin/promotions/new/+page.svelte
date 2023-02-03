<script lang="ts">
	import { enhance } from '$app/forms'
	import { Input, PageTitle, Select, TextArea } from '$lib/components'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	let { blends } = data

	export let form: ActionData

	let loading = false
</script>

<PageTitle title="New Promotion" />

<form
	method="post"
	action="?/editPromo"
	class="flex max-w-xl flex-col gap-3"
	use:enhance={async () => {
		loading = true
		return async ({ result, update }) => {
			await update()
			loading = false
		}
	}}
>
	<Input
		id="title"
		label="Title"
		required
		error={form?.parseErrors?.title?.[0]}
		disabled={loading}
	/>

	<Input
		id="subtitle"
		name="subtitle"
		label="Subtitle (brand, category, etc.)"
		error={form?.parseErrors?.subtitle?.[0]}
		disabled={loading}
	/>

	<Select
		id="blendId"
		label="Custom Blend"
		placeholder="None"
		options={blends.map((b) => ({ value: b.id, label: b.name }))}
		error={form?.parseErrors?.blendId?.[0]}
		disabled={loading}
	/>

	<Input
		id="validFrom"
		name="validFrom"
		label="Active Beginning This Day"
		type="datetime-local"
		inputClass="cursor-pointer"
		error={form?.parseErrors?.validFrom?.[0]}
		disabled={loading}
	/>

	<Input
		id="validUntil"
		name="validUntil"
		label="Active Until This Day"
		type="datetime-local"
		inputClass="cursor-pointer"
		error={form?.parseErrors?.validUntil?.[0]}
		disabled={loading}
	/>

	<TextArea
		id="sale"
		name="sale"
		label="Sale"
		rows={3}
		error={form?.parseErrors?.sale?.[0]}
		disabled={loading}
	/>

	<TextArea
		id="notes"
		name="notes"
		label="Notes"
		rows={3}
		error={form?.parseErrors?.notes?.[0]}
		disabled={loading}
	/>

	<button
		type="submit"
		class="btn-primary btn"
		disabled={loading}
	>
		Create
	</button>
</form>
