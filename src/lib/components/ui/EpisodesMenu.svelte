<script lang="ts">
	import { slide } from 'svelte/transition';
	import { outsideClick } from '$lib';
	import { Icon } from '$lib/icons';

	interface Props {
		isMenuOpen: boolean;
		threshold: number;
		totalEpisodes: number;
		currentRange: string;
		ranges: string[];
		onRangeSelect: (idx: number) => void;
	}

	let {
		isMenuOpen = $bindable(),
		threshold,
		totalEpisodes,
		ranges,
		currentRange,
		onRangeSelect
	}: Props = $props();
</script>

{#if totalEpisodes > threshold}
	<div>
		<button
			type="button"
			onclick={() => (isMenuOpen = !isMenuOpen)}
			{@attach outsideClick(() => {
				isMenuOpen = false;
			})}
			aria-label="episodes"
			aria-expanded={isMenuOpen}
			class="flex cursor-pointer items-center gap-x-1 text-sm font-light text-primary"
		>
			EPS: {currentRange}

			<Icon.Linear.ArrowUp
				class={`size-4 fill-neutral-300 transition-transform ${isMenuOpen && 'rotate-180'}`}
			/>
		</button>

		{#if isMenuOpen}
			<div
				class="menu-scroll absolute -left-0.5 z-10 max-h-44 w-full overflow-y-auto rounded-md bg-surface shadow-md"
				transition:slide
			>
				<ul class="bg-brand-primary-150/15">
					{#each ranges as range, index}
						<li>
							<button
								onclick={() => {
									isMenuOpen = false;
									onRangeSelect(index);
								}}
								type="button"
								class="w-full cursor-pointer p-3 hover:bg-brand-primary-150/30"
							>
								EPS: {range}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
{/if}
