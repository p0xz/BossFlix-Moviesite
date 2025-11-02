<script lang="ts">
	import type { Imdb } from '$lib/types/types';
	import { slide } from 'svelte/transition';
	import { outsideClick } from '$lib';

	interface Props {
		seasons: Imdb.Seasons[];
		isMenuOpen: boolean;
		currentSeason: number;
		onSeasonSelect: (season: number) => void;
	}

	let { seasons, isMenuOpen = $bindable(), currentSeason, onSeasonSelect }: Props = $props();
</script>

{#if seasons}
	<div class="relative max-sm:col-span-full max-sm:row-start-2 max-sm:w-full sm:col-start-3">
		<button
			onclick={() => {
				isMenuOpen = !isMenuOpen;
			}}
			{@attach outsideClick(() => {
				isMenuOpen = false;
			})}
			type="button"
			class="w-full cursor-pointer rounded-md bg-brand-primary-150/15 p-2 text-lg"
		>
			Season {currentSeason}
		</button>

		{#if isMenuOpen}
			<div
				class="menu-scroll absolute z-20 mt-2 max-h-44 w-full overflow-y-auto rounded-md bg-surface shadow-md"
				transition:slide
			>
				<ul class="bg-brand-primary-150/15">
					{#each seasons as season (season.number)}
						<li>
							<button
								onclick={() => {
									onSeasonSelect(season.number);
								}}
								type="button"
								class="w-full cursor-pointer p-3 hover:bg-brand-primary-150/30"
							>
								Season {season.number}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
{:else}
	<p class="text-lg">No seasons available.</p>
{/if}
