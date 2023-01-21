<script lang="ts">
	import { CustomBlendForm, PageTitle } from '$lib/components'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	const { flavors, user } = data

	export let form: ActionData
</script>

<PageTitle
	title="New Custom Blend"
	subtitle="Create a new named custom blend"
/>

<CustomBlendForm
	{flavors}
	formAction="?/createBlend"
	userRole={user.role}
	errors={form?.errors}
/>
