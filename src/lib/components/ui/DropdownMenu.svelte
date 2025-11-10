<script lang="ts" generics="T, K extends keyof T">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { outsideClick } from '$lib';

	interface Props<U, V extends keyof U> {
		children: Snippet<[]>;
		items: U[];
		keyProp?: V;
		isMenuOpen: boolean;
		label: string;
		onSelect: (item: U) => void;
		fallback?: string;
	}

	let {
		items,
		isMenuOpen = $bindable(),
		keyProp,
		label,
		onSelect,
		children,
		fallback = 'Unavailable',
	}: Props<T, K> = $props();
</script>

{#if items}
	<div class="relative w-full">
		<button
			onclick={() => {
				isMenuOpen = !isMenuOpen;
			}}
			{@attach outsideClick(() => {
				isMenuOpen = false;
			})}
			type="button"
			aria-haspopup="menu"
			class="flex h-full w-full cursor-pointer items-center justify-center gap-x-2
			       rounded-md bg-brand-primary-150/15 px-3 py-2 text-sm text-primary
			       shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-brand-primary-150/25 hover:text-neutral-200"
		>
			{@render children?.()}
		</button>

		{#if isMenuOpen}
			<ul
				role="menu"
				class="menu-scroll absolute right-0 z-20 mt-2 max-h-44 w-full overflow-y-auto
				       rounded-lg border border-[#1F2433]/75 bg-[#181926]/80 p-1.5 text-sm text-primary
				       shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl"
				transition:slide
			>
				{#each items as item, idx (idx)}
					<li>
						<button
							onclick={() => onSelect(item)}
							type="button"
							class="w-full cursor-pointer rounded-md p-3 hover:bg-[#727DA1]/15 hover:text-neutral-200"
						>
							{label}
							{typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
								? item
								: keyProp && String(items[idx][keyProp])}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{:else}
	<p class="text-lg">{fallback}</p>
{/if}
