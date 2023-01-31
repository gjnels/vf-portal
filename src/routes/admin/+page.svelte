<script lang="ts">
	import { PageTitle } from '$lib/components'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<PageTitle title="Admin Dashboard" />

<div class="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
	<div class="card-bordered card min-h-[20rem] bg-neutral shadow-md">
		<div class="card-body">
			<h2 class="card-title text-2xl">Promotions</h2>
			<div class="divider m-0" />
			<p class="flex flex-col gap-1">
				<span class="underline underline-offset-2">Current Promotions</span>
				{#if data.activePromos.length > 0}
					<ul>
						{#each data.activePromos as promo (promo.id)}
							<li>
								<span>{promo.title}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<span class="text-sm font-light italic">None currently active</span>
				{/if}
			</p>
			<p>Upcoming promotions: {data.futurePromos || 'none'}</p>
			<p>Expired promotions: {data.expiredPromos || 'none'}</p>
		</div>
	</div>

	<div class="card-bordered card min-h-[20rem] bg-neutral shadow-md">
		<div class="card-body">
			<h2 class="card-title text-2xl">Users</h2>
			<div class="divider m-0" />
			<p>Admins: {data.userCount.admin}</p>
			<p>Managers: {data.userCount.manager}</p>
			<p>Stores: {data.userCount.store}</p>
			<p>Basic Users: {data.userCount.user}</p>
		</div>
	</div>

	<div class="card-bordered card min-h-[20rem] bg-neutral shadow-md">
		<div class="card-body">
			<h2 class="card-title text-2xl">Missing SKUs</h2>
			<div class="divider m-0" />
		</div>
	</div>
</div>
