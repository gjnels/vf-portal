<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms'
	import { Input } from '$lib/components'
	import toast from 'svelte-french-toast'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	export let form: ActionData
</script>

<h1 class="mb-4 text-center text-4xl font-semibold">Login to your account</h1>

<form
	method="post"
	action="?/login{data.redirectTo ? `&redirectTo=${data.redirectTo}` : ''}"
	class="mx-auto flex w-full max-w-md flex-col gap-3"
	use:enhance={async () => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				toast.success('Successfully logged in!')
			}
			await applyAction(result)
		}
	}}
>
	<Input
		type="email"
		id="email"
		name="email"
		label="Your email address"
		value={form?.data.email || ''}
		error={form?.formErrors?.email?.[0]}
	/>

	<Input
		type="password"
		id="password"
		name="password"
		label="Your password"
		error={form?.formErrors?.password?.[0]}
	/>

	{#if form?.authError}
		<span class="text-lg text-error">{form.authError}</span>
	{/if}

	<button
		type="submit"
		class="btn-primary btn">Login</button
	>
</form>
