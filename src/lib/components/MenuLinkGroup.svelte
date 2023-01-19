<script lang="ts">
	import type { Links } from '$lib/links'
	import type { Role } from '@prisma/client'
	import MenuLink from './MenuLink.svelte'

	export let links: Links
	export let access: Role[] | undefined = undefined
	export let role: Role | undefined = undefined
	export let onclick: () => void
	export let first = false
</script>

{#if links.length > 0 && (!access || (role && access.includes(role)))}
	{#if !first}
		<div class="divider" />
	{/if}

	{#each links as link (link.href)}
		{#if link.children}
			{#each link.children as childLink (childLink.href)}
				<MenuLink
					href={link.href + childLink.href}
					label={childLink.label}
					icon={childLink.icon}
					{onclick}
				/>
			{/each}
		{:else}
			<MenuLink
				href={link.href}
				label={link.label}
				icon={link.icon}
				{onclick}
			/>
		{/if}
	{/each}
{/if}
