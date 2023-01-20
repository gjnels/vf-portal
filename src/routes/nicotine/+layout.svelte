<script lang="ts">
	import { page } from '$app/stores'
	import { PageTitle } from '$lib/components'

	$: tab = $page.url.pathname.split('/').at(-1)

	$: subtitle =
		tab === 'packets'
			? 'Calculate the necessary nicotine packets to adjust the nicotine level of any bottle size'
			: 'Calculate the total nicotine level based on which packets are being added to a bottle'
</script>

<PageTitle
	title="Nicotine Calculator"
	{subtitle}
/>

<div class="tabs tabs-boxed mb-6 w-fit">
	<a
		href="/nicotine/packets"
		class="tab {tab === 'packets' ? 'tab-active' : ''}"
	>
		Calculate Packets
	</a>
	<a
		href="/nicotine/level"
		class="tab {tab === 'level' ? 'tab-active' : ''}"
	>
		Calculate Level
	</a>
</div>

<slot />
