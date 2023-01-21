<script lang="ts">
	import type { LayoutData } from './$types'
	import { MenuLink, PageTitle } from '$lib/components'
	import { page } from '$app/stores'
	import { Cog, User } from 'svelte-hero-icons'

	export let data: LayoutData
</script>

<PageTitle title="My Account" />

<div class="mb-6">
	<p class="text-2xl">{data.user.name || data.user.email}</p>
	<p class="font-light">{data.user.role} Account</p>
</div>

<div class="flex grow flex-col md:flex-row">
	<ul class="menu menu-compact flex-none gap-2 border-base-content/10 md:w-52">
		<MenuLink
			href="profile"
			label="Profile"
			icon={User}
		/>
		<MenuLink
			href="security"
			label="Security"
			icon={Cog}
		/>
	</ul>
	<div class="divider divider-vertical md:divider-horizontal" />
	<div class="flex-1 md:max-w-xl">
		<slot />
	</div>
</div>
