<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { BackLink, Input, PageTitle, Select } from '$lib/components'
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

<BackLink
	href="/admin/users"
	label="Back to all users"
/>

<p class="mb-6 flex items-center gap-1 text-info">
	<Icon
		src={InformationCircle}
		size="1.5em"
	/>
	Set role to User to remove all permissions
</p>

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
	<!-- <label
		for="delete-modal"
		class="btn-secondary btn mb-2"
	>
		Delete User
	</label> -->

	<input
		hidden
		name="id"
		value={data.user.id}
	/>

	<Input
		id="email"
		label="Email"
		value={data.user.email}
		disabled
	/>
	<Input
		id="name"
		label="Name"
		value={data.user.name || ''}
		disabled
	/>

	<Select
		id="role"
		label="Role"
		options={roles.map((r) => ({ value: r, label: r }))}
		value={form?.data?.role ?? data.user.role}
	/>

	<Select
		id="location"
		label="Location"
		options={data.locations.map((l) => ({ value: l.id, label: l.name }))}
		value={form?.data?.location ?? data.user.locationId ?? ''}
		placeholder="None"
	/>

	<button
		type="submit"
		class="btn-primary btn">Update</button
	>
</form>

<!-- <input
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
		<p>Are you sure you want to delete this user? This cannot be undone.</p>
		<form
			class="modal-action"
			method="post"
			action="?/deleteUser"
			use:enhance={async () => {
				return async ({ result }) => {
					console.log(result)
					if (result.type === 'success' || result.type === 'redirect') {
						toast.success('User deleted')
						await applyAction(result)
					} else {
						toast.error('Error deleting user')
					}
				}
			}}
		>
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
</label> -->
