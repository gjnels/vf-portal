<script lang="ts">
	import { page } from '$app/stores'
	import { Icon, ExclamationCircle, ShieldExclamation } from 'svelte-hero-icons'

	let icon = ExclamationCircle
	let title = 'Oops!'
	let message = 'An unexpected error has occurred. Try again later.'

	switch ($page.status) {
		case 403:
			icon = ShieldExclamation
			title = 'Unauthorized'
			message = 'You are not authorized to view this page'
			break
		case 404:
			title = 'Not found'
			message = 'This page does not exist'
			break
	}
</script>

<div class="flex flex-col items-center gap-6">
	<div class="flex items-center gap-2 text-error">
		<Icon
			src={icon}
			size="5rem"
			class="text-error"
		/>
		<h1 class="text-xl font-bold uppercase">{title}</h1>
	</div>
	<p>{message}</p>
	<a
		href="/"
		class="btn btn-primary">Go to Dashboard</a
	>
</div>
