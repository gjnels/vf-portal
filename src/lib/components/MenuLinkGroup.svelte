<script lang="ts">
	import type { Link } from '$lib/links'
	import type { Role } from '@prisma/client'
	import MenuLink from './MenuLink.svelte'

	export let links: Link[]
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
		<MenuLink
			{...link}
			{onclick}
		/>
	{/each}
{/if}
