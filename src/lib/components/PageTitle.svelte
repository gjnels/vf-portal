<script lang="ts">
	export let title: string
	export let subtitle: string | undefined = undefined
</script>

<h1 class="mb-6 text-5xl font-bold">
	{title}
	{#if subtitle}
		<p class="text-base font-light">{subtitle}</p>
	{/if}
</h1>
