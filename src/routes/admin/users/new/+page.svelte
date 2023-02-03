<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { Input, PageTitle } from '$lib/components'
	import toast from 'svelte-french-toast'
	import type { ActionData } from './$types'

	export let form: ActionData
</script>

<PageTitle
	title="Invite a User"
	subtitle="Invite a new user to join the portal"
/>

<form
	class="flex max-w-xl flex-col gap-3"
	method="post"
	action="?/inviteUser"
	use:enhance={async () => {
		return async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				toast.success(`Email invitation sent`)
			}
			await applyAction(result)
		}
	}}
>
	<Input
		id="email"
		label="Email address"
		type="email"
		value={form?.data?.email ?? ''}
		error={form?.errors?.email?.[0]}
	/>

	<button
		type="submit"
		class="btn-primary btn">Invite</button
	>
</form>
