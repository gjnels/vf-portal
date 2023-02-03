<script lang="ts">
	import { PageTitle } from '$lib/components'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<PageTitle
	title="All Users"
	subtitle="All registered users for VaporFi Columbus (not including yourself)"
/>

<a
	href="/admin/users/new"
	class="btn-accent btn mb-6 w-fit">Invite New User</a
>

{#if data.users.length > 0}
	<div class="overflow-x-auto rounded-lg">
		<table class="table w-full">
			<thead>
				<tr>
					<th />
					<th>Email</th>
					<th>Name</th>
					<th>Role</th>
					<th>Location</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user (user.id)}
					<tr class="hover">
						<th
							><a
								href="/admin/users/{user.id}"
								class="btn-primary btn-sm btn"
							>
								Edit
							</a></th
						>
						<th>{user.email}</th>
						<th>{user.name ?? ''}</th>
						<th>{user.role}</th>
						<th>{user.location?.name ?? ''}</th>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th />
					<th>Email</th>
					<th>Name</th>
					<th>Role</th>
					<th>Location</th>
				</tr>
			</tfoot>
		</table>
	</div>
{:else}
	<p class="italic opacity-75">No users found</p>
{/if}
