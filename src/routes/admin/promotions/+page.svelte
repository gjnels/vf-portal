<script lang="ts">
	import { PageTitle } from '$lib/components'
	import { formatPromoTableDate } from '$lib/utils/dates'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<PageTitle
	title="Promotions"
	subtitle="Create, edit, and delete promotions"
/>

<a
	href="/admin/promotions/new"
	class="btn-accent btn mb-6 w-fit"
>
	New Promotion
</a>

<div class="overflow-x-auto rounded-lg">
	<table class="table w-full">
		<thead>
			<tr>
				<th />
				<th>Title</th>
				<th>Subtitle</th>
				<th>Valid From</th>
				<th>Valid Until</th>
				<th>Custom Blend</th>
				<th>Sale</th>
				<th>Notes</th>
				<th>Created At</th>
				<th>Created By</th>
				<th>Updated At</th>
				<th>Updated By</th>
			</tr>
		</thead>
		<tbody>
			{#each data.promos as promo (promo.id)}
				<tr class="hover">
					<th>
						<a
							href="/admin/promotions/{promo.id}"
							class="btn-primary btn-sm btn">Edit</a
						>
					</th>
					<th class="text-lg">{promo.title}</th>
					<td>{promo.subtitle ?? ''}</td>
					<td class="whitespace-pre">{formatPromoTableDate(promo.validFrom)}</td>
					<td class="whitespace-pre">{formatPromoTableDate(promo.validUntil)}</td>
					<td>
						{#if promo.blend}
							<a
								href="/custom-blends/{promo.blend.id}"
								class="link-hover link-info">{promo.blend.name}</a
							>
						{/if}
					</td>
					<td class="table-cell whitespace-pre">{promo.sale ?? ''}</td>
					<td class="table-cell whitespace-pre">{promo.notes ?? ''}</td>
					<td class="whitespace-pre">{formatPromoTableDate(promo.createdAt)}</td>
					<td>
						{#if promo.createdBy}
							{#if promo.createdBy.id === data.user.id}
								<span class="text-info">You</span>
							{:else}
								<a
									href="/admin/users/{promo.createdBy.id}"
									class="link-hover link-info">{promo.createdBy.name ?? promo.createdBy.email}</a
								>
							{/if}
						{:else if promo.createdById}
							<span class="text-sm italic opacity-75">User not found</span>
						{/if}
					</td>
					<td class="whitespace-pre">{formatPromoTableDate(promo.updatedAt)}</td>
					<td>
						{#if promo.updatedBy}
							{#if promo.updatedBy.id === data.user.id}
								<span class="text-info">You</span>
							{:else}
								<a
									href="/admin/users/{promo.updatedBy.id}"
									class="link-hover link-info">{promo.updatedBy.name ?? promo.updatedBy.email}</a
								>
							{/if}
						{:else if promo.updatedById}
							<span class="text-sm italic opacity-75">User not found</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th />
				<th>Title</th>
				<th>Subtitle</th>
				<th>Valid From</th>
				<th>Valid Until</th>
				<th>Custom Blend</th>
				<th>Sale</th>
				<th>Notes</th>
				<th>Created At</th>
				<th>Created By</th>
				<th>Updated At</th>
				<th>Updated By</th>
			</tr>
		</tfoot>
	</table>
</div>
