<script lang="ts">
	import '../tailwind.css'
	import { Toaster } from 'svelte-french-toast'
	import { Logo, MenuLinkGroup } from '$lib/components'
	import { ChevronDown, Icon, Menu } from 'svelte-hero-icons'
	import { links } from '$lib/links'
	import type { LayoutData } from './$types'
	import { onMount } from 'svelte'
	import { sb } from '$lib/supabase'
	import { invalidate } from '$app/navigation'

	export let data: LayoutData

	onMount(() => {
		const {
			data: { subscription: authListener }
		} = sb.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})

		return () => {
			authListener.unsubscribe()
		}
	})

	let navigationOpen = false
	const toggleNavigation = () => {
		navigationOpen = !navigationOpen
	}
</script>

<svelte:head>
	<title>VaporFi Columbus</title>
</svelte:head>

<Toaster />

<div class="drawer">
	<input
		id="navigation"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={navigationOpen}
		tabindex="-1"
	/>
	<div class="drawer-content flex flex-col">
		<nav class="navbar sticky top-0 z-10 border-b border-base-300 bg-base-100/95 shadow">
			<div class="navbar-start">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<label
					for="navigation"
					class="btn-ghost btn btn-square btn-sm"
				>
					<Icon src={Menu} />
				</label>
				<a
					href="/"
					class="link ml-4"
				>
					<Logo />
				</a>
			</div>

			<div class="navbar-end">
				{#if data.user}
					<div class="dropdown-hover dropdown-end dropdown">
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<label
							for=""
							tabindex="0"
							class="btn-ghost btn btn-sm flex-nowrap gap-1 normal-case tracking-wide"
						>
							<span>{data.user?.name ?? data.user.email}</span>
							<Icon
								src={ChevronDown}
								size="1.5em"
							/>
						</label>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<ul
							tabindex="0"
							class="dropdown-content menu rounded-box min-w-[10rem] bg-base-300 p-2 shadow"
						>
							<li>
								<a href="/account">My Profile</a>
							</li>
							<li>
								<form
									action="/logout"
									method="post"
								>
									<button type="submit">Logout</button>
								</form>
							</li>
						</ul>
					</div>
				{:else}
					<a
						href="/login"
						class="btn-outline btn btn-accent btn-sm mr-2"
					>
						Login
					</a>
				{/if}
			</div>
		</nav>

		<main class="mx-auto flex w-full max-w-screen-2xl grow flex-col px-10 py-6">
			<slot />
		</main>

		<footer class="border-t border-base-300 p-2 text-center text-xs font-light">
			Created by Garrett Nelson &copy;2023
		</footer>
	</div>

	<div class="drawer-side">
		<label
			for="navigation"
			class="drawer-overlay"
		/>
		<ul class="menu w-80 gap-2 overflow-y-auto bg-base-100 p-4">
			<MenuLinkGroup
				{links}
				onclick={toggleNavigation}
				first
			/>
		</ul>
	</div>
</div>
