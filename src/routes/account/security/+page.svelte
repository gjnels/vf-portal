<script lang="ts">
	import { enhance } from '$app/forms'
	import { Input } from '$lib/components'
	import toast from 'svelte-french-toast'
	import type { ActionData, PageData } from './$types'

	export let data: PageData

	export let form: ActionData

	let loading = false
</script>

<h2 class="mb-10 text-3xl font-semibold">Security Settings</h2>

<form
	method="post"
	action="?/updatePassword"
	class="flex flex-col gap-6"
	use:enhance={async () => {
		loading = true
		return async ({ result, update }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				toast.success('Password updated! Login again with your new password', { duration: 4000 })
			}
			await update()
			loading = false
		}
	}}
>
	<h3 class="text-lg">Change Your Password</h3>

	<Input
		type="password"
		id="password"
		name="password"
		label="Your new password"
		error={form?.errors?.password?.[0]}
		disabled={loading}
	/>

	<Input
		type="password"
		id="passwordConfirm"
		name="passwordConfirm"
		label="Confirm your new password"
		error={form?.errors?.passwordConfirm?.[0]}
		disabled={loading}
	/>

	<button
		type="submit"
		class="btn btn-primary"
		disabled={loading}
	>
		Submit
	</button>
</form>
