<script lang="ts">
	import { PageTitle } from '$lib/components'
	import type { PageData } from './$types'
	import { createDisplayBlendString } from '$lib/utils/flavors'
	import { formatPromoDate } from '$lib/utils/dates'

	export let data: PageData
</script>

<PageTitle
	title="Promotions"
	subtitle="Currently active promotions"
/>

{#if data.promos.length === 0}
	<span class="italic text-error">No current promotions</span>
{:else}
	<ul class="mx-auto grid w-full gap-8 lg:grid-cols-2">
		{#each data.promos as promo (promo.id)}
			<li class="card bg-base-300 text-base-content shadow">
				<div class="card-body">
					<h3 class="card-title text-4xl">{promo.title}</h3>
					{#if promo.subtitle}
						<div class="divider m-0" />
						<p class="text-2xl">{promo.subtitle}</p>
					{/if}
					{#if promo.blend}
						<div class="divider m-0" />
						<div>
							<p class="text-2xl">{promo.blend.name}</p>
							<p>{createDisplayBlendString(promo.blend)}</p>
						</div>
					{/if}
					<div class="divider m-0" />
					<div>
						<p class="text-lg font-light underline underline-offset-2">Begins</p>
						<p>{formatPromoDate(promo.validFrom)}</p>
					</div>
					<div>
						<p class="text-lg font-light underline underline-offset-2">Ends</p>
						<p>{formatPromoDate(promo.validUntil)}</p>
					</div>
					{#if promo.sale}
						<div class="divider m-0" />
						<div>
							<p class="text-lg font-light underline underline-offset-2">Sale</p>
							<p class="whitespace-pre-wrap">{promo.sale}</p>
						</div>
					{/if}
					{#if promo.notes}
						<div class="divider m-0" />
						<p class="mt-2 whitespace-pre-wrap font-light">{promo.notes}</p>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{/if}
