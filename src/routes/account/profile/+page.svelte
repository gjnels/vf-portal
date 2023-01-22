<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { invalidate, invalidateAll } from '$app/navigation'
	import { Input, Select } from '$lib/components'
	import toast from 'svelte-french-toast'
	import { ExclamationCircle, Icon } from 'svelte-hero-icons'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	$: user = data.user
	let { locations } = data
	export let form: ActionData

	let loading = false
</script>

<h2 class="mb-10 text-3xl font-semibold">Profile Settings</h2>

<form
	method="post"
	action="?/updateProfile"
	class="flex flex-col gap-6"
	use:enhance={async () => {
		loading = true
		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Profile updated!')
				// await invalidate('supabase:auth')
				await invalidateAll()
			}
			await applyAction(result)
			loading = false
		}
	}}
>
	<div>
		<p class="underline underline-offset-2">Email Address</p>
		<p>{user.email}</p>
	</div>

	{#if user.role === 'Admin'}
		<Select
			id="role"
			label="Role"
			options={[
				{ value: 'User', label: 'User' },
				{ value: 'Store', label: 'Store' },
				{ value: 'Manager', label: 'Manager' },
				{ value: 'Admin', label: 'Admin' }
			]}
			value={form?.data.role ?? user.role}
			placeholder={null}
			disabled={loading}
			error={form?.errors?.role?.[0]}
		/>
		<p class="-mt-3 flex gap-2 text-sm text-warning">
			<Icon
				src={ExclamationCircle}
				size="1.5em"
			/>
			<span> If you change your role, only another Admin user can make you an Admin again. </span>
		</p>

		{#if locations}
			<Select
				id="location"
				label="Location"
				options={locations.map((l) => ({ label: l.name, value: l.id }))}
				value={user.locationId ?? ''}
				placeholder="Select a location"
				disabled={loading}
				error={form?.errors?.location?.[0]}
			/>
		{/if}
	{:else}
		<div>
			<p class="underline underline-offset-2">Location</p>
			{#if user.location}
				<p>{user.location.name}</p>
			{:else}
				<p class="font-light italic">Location not set</p>
			{/if}
		</div>
	{/if}

	<Input
		id="name"
		name="name"
		label="Your name"
		value={form?.data.name ?? user.name ?? ''}
		placeholder="Leave blank to remove your name"
		disabled={loading}
		error={form?.errors?.name?.[0]}
	/>

	<button
		type="submit"
		class="btn btn-primary"
		disabled={loading}
	>
		Update
	</button>
</form>
