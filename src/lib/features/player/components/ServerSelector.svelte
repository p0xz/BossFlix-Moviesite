<script lang="ts">
	import { Icon } from '$lib/icons';
	import { clickOutsideOfNode } from '$lib/core/actions/clickOutside';
	import type { SourceOrigin } from '$lib/features/player/config/source.config';
	import { fly } from 'svelte/transition';

	interface Props {
		selectedServer: 'native' | SourceOrigin;
	}

	let { selectedServer = $bindable() }: Props = $props();

	type ServerOption = 'native' | SourceOrigin;

	const servers: { id: ServerOption; label: string }[] = [
		{ id: 'vidsrc', label: 'VidSrc (Default)' },
		{ id: 'vidstream', label: 'VidStream' },
		{ id: 'superembed', label: 'SuperEmbed' },
		{ id: 'primewire', label: 'PrimeWire' },
		{ id: 'moviestream', label: 'MovieStream' },
	];

	let isServerMenuOpen = $state(false);
	let serverMenuButton = $state<HTMLButtonElement | null>(null);

	function selectServer(server: ServerOption) {
		selectedServer = server;
		isServerMenuOpen = false;
	}
</script>

<div class="relative z-50">
	<button
		bind:this={serverMenuButton}
		onclick={() => (isServerMenuOpen = !isServerMenuOpen)}
		class="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all hover:bg-white/5 hover:text-brand-primary-100"
	>
		<Icon.Linear.Server class="size-4 fill-current" />
		<span>{servers.find((s) => s.id === selectedServer)?.label}</span>
		<Icon.Linear.ChevronDown class="size-3 transition-transform duration-200 {isServerMenuOpen ? 'rotate-180' : ''}" />
	</button>

	{#if isServerMenuOpen}
		<div
			class="absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#15161c] shadow-2xl backdrop-blur-lg"
			transition:fly={{ y: -10, duration: 200 }}
			{@attach clickOutsideOfNode((event) => {
				if (serverMenuButton?.contains(event.target as Node)) return;
				isServerMenuOpen = false;
			})}
		>
			<div class="p-1 [&_button]:not-last:mb-1">
				<p class="px-3 py-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase">Select Server</p>
				{#each servers as server (server.id)}
					<button
						class={[
							'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors',
							selectedServer === server.id
								? 'bg-brand-primary-100/10 text-brand-primary-100'
								: 'text-gray-300 hover:bg-white/5 hover:text-white',
						]}
						onclick={() => selectServer(server.id)}
					>
						<span>{server.label}</span>
						{#if selectedServer === server.id}
							<Icon.Linear.Check class="size-3.5 fill-current" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
