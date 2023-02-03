<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { Input, PageTitle, Select } from '$lib/components'
	import type { Role } from '@prisma/client'
	import { Icon, InformationCircle } from 'svelte-hero-icons'
	import type { ActionData, PageData } from './$types'
	import toast from 'svelte-french-toast'

	export let data: PageData
	export let form: ActionData

	const roles: Role[] = ['User', 'Store', 'Manager', 'Admin']

	let loading = false
</script>

<PageTitle title="Edit User" />

<div class="space-y-4 mb-6">
	<p class="flex items-center gap-1 text-info">
		<Icon
			src={InformationCircle}
			size="1.5em"
		/>
		Set role to User to remove all permissions
	</p>
	<p>Email: <span class="font-semibold">{data.user.email}</span></p>
	<p>
		Name: <span class={data.user.name ? 'font-semibold' : 'italic font-light'}
			>{data.user.name ?? 'not set'}</span
		>
	</p>
</div>

<form
	class="flex max-w-xl flex-col gap-3"
	method="post"
	action="?/updateUser"
	use:enhance={async () => {
		loading = true
		return async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				toast.success('User updated')
			}
			await applyAction(result)
		}
	}}
>
	<input
		hidden
		name="id"
		value={data.user.id}
	/>

	<Select
		id="role"
		label="Role"
		options={roles.map((r) => ({ value: r, label: r }))}
		error={form?.parseErrors?.role?.[0]}
		value={data.user.role}
	/>

	<Select
		id="location"
		label="Location"
		options={data.locations.map((l) => ({ value: l.id, label: l.name }))}
		error={form?.parseErrors?.location?.[0]}
		value={data.user.locationId ?? ''}
		placeholder="None"
	/>

	<button
		type="submit"
		class="btn-primary btn">Update</button
	>
</form>
