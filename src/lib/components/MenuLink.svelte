<script lang="ts">
	import { page } from '$app/stores'
	import { Icon, type IconSource } from 'svelte-hero-icons'

	export let href: string
	export let label: string
	export let icon: IconSource | undefined = undefined
	export let activeHref: string | undefined = undefined
	export let showActive = true
	export let onclick: (() => void) | undefined = undefined

	$: active = $page.url.pathname.includes(activeHref ?? href)
</script>

<li
	class="flex-row gap-1 before:my-1.5 before:w-1 before:rounded-full before:transition before:duration-200 before:content-[''] {showActive &&
	active
		? 'before:bg-primary'
		: ''}"
>
	<a
		{href}
		class="grow rounded-lg {active ? 'bg-base-content/10' : ''}"
		on:click={onclick}
	>
		{#if icon}
			<Icon
				src={icon}
				size="1.5em"
			/>
		{/if}
		<span>{label}</span>
	</a>
</li>
