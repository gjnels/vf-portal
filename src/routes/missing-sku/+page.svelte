<script lang="ts">
	import { enhance } from '$app/forms'
	import { Input, PageTitle } from '$lib/components'
	import toast from 'svelte-french-toast'
	import type { ActionData } from './$types'

	export let form: ActionData

	let loading = false
</script>

<PageTitle
	title="Missing SKU"
	subtitle="Submit an item that has an incorrect SKU or a missing SKU"
/>

<form
	method="post"
	class="flex flex-col gap-6 max-w-xl"
	use:enhance={async () => {
		loading = true
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success('SKU submitted!')
			}
			await update()
			loading = false
		}
	}}
>
	<Input
		id="sku"
		label="SKU"
		disabled={loading}
		error={form?.parseErrors?.sku?.[0] || form?.skuError}
	/>

	<Input
		id="item"
		label="Item Name"
		disabled={loading}
		error={form?.parseErrors?.item?.[0]}
	/>

	<button
		type="submit"
		class="btn btn-primary"
		disabled={loading}>Submit</button
	>
</form>
