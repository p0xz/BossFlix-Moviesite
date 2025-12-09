<script lang="ts" generics="T extends Record<string, boolean>, K extends keyof T">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { outsideClick } from '$lib/attachments';

	interface Props<U, V> {
		children: Snippet<[]>;
		items: U;
		isMenuOpen: boolean;
		fallback?: string;
		keyWrapper?: (key: string) => string;
	}

	let { items = $bindable(), isMenuOpen = $bindable(), keyWrapper, children, fallback = 'Unavailable' }: Props<T, K> = $props();
</script>

{#if Object.keys(items).length}
	<div
		class="relative w-full"
		{@attach outsideClick(() => {
			isMenuOpen = false;
		})}
	>
		<button
			onclick={() => {
				isMenuOpen = !isMenuOpen;
			}}
			type="button"
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
				{#each Object.entries(items) as [key] (key)}
					<li>
						<label
							class="relative inline-flex w-full cursor-pointer items-center justify-between rounded-md p-3 hover:bg-brand-primary-150/25 hover:text-neutral-200"
						>
							<span>
								{typeof keyWrapper === 'function' ? keyWrapper(key) : key}
							</span>
							<input type="checkbox" class="peer sr-only" bind:checked={items[key]} />
							<span
								class="relative h-5 w-9 rounded-full bg-neutral-700 transition-all
	       peer-checked:bg-brand-green-100
	       after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white
	       after:transition-transform after:duration-300 after:ease-in-out
	       peer-checked:after:translate-x-4"
							></span>
						</label>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{:else}
	<p class="text-lg">{fallback}</p>
{/if}
