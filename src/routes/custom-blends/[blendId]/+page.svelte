<script lang="ts">
	import { CustomBlendForm, PageTitle } from '$lib/components'
	import { formatPromoDate } from '$lib/utils/dates'
	import { ArrowSmLeft, Icon } from 'svelte-hero-icons'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	const { flavors, user, blend } = data

	export let form: ActionData
</script>

<PageTitle
	title="Edit Custom Blend"
	subtitle="Editing custom blend: {blend.name}"
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

<div class="mb-6 flex flex-col gap-3">
	<p>
		Created: <span class="text-success">{formatPromoDate(blend.createdAt)}</span>
		{#if blend.createdBy}
			by {#if blend.createdBy.id === data.user.id}
				<span class="text-info">You</span>
			{:else}
				<a
					href="/admin/users/{blend.createdBy.id}"
					class="link link-info link-hover">{blend.createdBy.name ?? blend.createdBy.email}</a
				>
			{/if}
		{/if}
	</p>

	<p>
		Updated: <span class="text-success">{formatPromoDate(blend.updatedAt)}</span>
		{#if blend.updatedBy}
			by {#if blend.updatedBy.id === data.user.id}
				<span class="text-info">You</span>
			{:else}
				<a
					href="/admin/users/{blend.updatedBy.id}"
					class="link link-info link-hover">{blend.updatedBy.name ?? blend.updatedBy.email}</a
				>
			{/if}
		{/if}
	</p>

	{#if blend.approved && blend.approvedBy}
		<p>
			Approved by: {#if blend.approvedBy.id === data.user.id}
				<span class="text-info">You</span>
			{:else}
				<a
					href="/admin/users/{blend.approvedBy.id}"
					class="link link-info link-hover">{blend.approvedBy.name ?? blend.approvedBy.email}</a
				>
			{/if}
		</p>
	{/if}

	{#if blend.promo}
		<p>
			Promotion: <span class="text-info">{blend.promo.title}</span>
			{#if blend.promo.validFrom >= new Date() || blend.promo.validUntil <= new Date()}
				<span class="text-warning">(promotion not active)</span>
			{/if}
		</p>
	{/if}
</div>

<CustomBlendForm
	{flavors}
	formAction="?/updateBlend"
	userRole={user.role}
	errors={form?.errors}
	{blend}
/>
