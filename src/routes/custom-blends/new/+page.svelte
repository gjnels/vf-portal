<script lang="ts">
	import { CustomBlendForm, PageTitle } from '$lib/components'
	import { ArrowSmLeft, Icon } from 'svelte-hero-icons'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	const { flavors, user } = data

	export let form: ActionData
</script>

<PageTitle
	title="New Custom Blend"
	subtitle="Create a new named custom blend"
/>

<a
	href="/custom-blends"
	class="link mb-6 flex gap-1"
>
	<Icon
		src={ArrowSmLeft}
		size="1.5em"
	/>
	Back to Custom Blends
</a>

<CustomBlendForm
	{flavors}
	formAction="?/createBlend"
	userRole={user.role}
	errors={form?.errors}
/>
