<script lang="ts">
	import { Icon } from '$lib/icons';
	import { VideoController } from '$lib/features/player/logic/player.svelte';
	import { SubtitleController } from '$lib/features/player/logic/subtitles.svelte';
	import { onMount } from 'svelte';
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import { clickOutsideOfNode } from '$lib/core/actions/clickOutside';
	import type { SubtitleLanguage } from '$lib/features/subtitles/subtitles';

	interface VideoPlayerProps {
		url: string;
		class: string;
		mediaTitle: string;
		imdbId?: string;
		season?: number;
		episode?: number;
		autoPlay?: boolean;
		onEnded?: () => void;
	}

	let {
		url,
		mediaTitle,
		imdbId,
		season,
		episode,
		autoPlay = $bindable(false),
		onEnded,
		class: className,
		...rest
	}: VideoPlayerProps & HTMLVideoAttributes = $props();

	const player = new VideoController();
	const subtitles = new SubtitleController();

	let autoNext = $state(true);

	$effect(() => {
		subtitles.updateMediaInfo(imdbId, season, episode);
	});

	let playerContainer = $state<HTMLElement | null>(null);
	let playerSettingsMenu = $state<HTMLButtonElement | null>(null);
	let videoDisappearTimeout: ReturnType<typeof setTimeout> | null = null;
	let videoUIVisible = $state<boolean>(true);

	let isSettingsOpen = $state<boolean>(false);

	$effect(() => {
		player.initHls(url);
	});

	function handleTimelineClick(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const percent = ((e.clientX - rect.left) / rect.width) * 100;
		player.seek(percent);
	}

	function toggleFullscreen() {
		if (!playerContainer) return;

		if (!document.fullscreenElement) {
			playerContainer.requestFullscreen();
		} else {
			document.exitFullscreen?.();
		}
	}

	function handleUIState() {
		videoUIVisible = true;

		if (videoDisappearTimeout) clearTimeout(videoDisappearTimeout);
		videoDisappearTimeout = setTimeout(() => {
			if (player.isPlaying) {
				videoUIVisible = false;
			}
		}, 3000);
	}
</script>

<div
	bind:this={playerContainer}
	class={['group bg-black+ relative overflow-hidden', className, !videoUIVisible ? 'cursor-none' : '']}
	onmousemove={handleUIState}
	role="application"
>
	<video
		bind:this={player.element}
		id="media-player"
		class="relative h-full w-full object-contain"
		autoplay={autoPlay}
		ontimeupdate={() => {
			player.onTimeUpdate();
			subtitles.updateCurrentTime(player.element?.currentTime ?? 0);
		}}
		ondurationchange={player.onDurationChange}
		onplay={player.onPlayPause}
		onpause={player.onPlayPause}
		onended={() => {
			if (autoNext && onEnded) onEnded();
		}}
		onclick={() => player.togglePlay()}
	></video>
	
	{#if !url}
		<div class="absolute inset-0 z-50 flex items-center justify-center bg-black">
			<div class="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-brand-primary-100"></div>
		</div>
	{/if}

	<!-- Custom Subtitle Display -->
	<div
		class="pointer-events-none absolute right-0 bottom-16 left-0 flex justify-center px-12 text-center transition-all duration-300"
	>
		<span
			id="subtitle-display"
			class={[
				'rounded-xl bg-black/75 px-6 py-3 text-lg leading-relaxed text-white transition-all duration-200 md:text-2xl',
				subtitles.currentText ? 'pointer-events-auto' : 'hidden',
			]}
		>
			{@html subtitles.currentText.replace(/\n/g, '<br>')}
		</span>
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="button"
		tabindex="0"
		class={[
			'absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/90 via-transparent to-black/60 transition-opacity duration-300 md:p-8',
			videoUIVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none cursor-none opacity-0',
		]}
		onclick={(event) => {
			if (player.element && event.target === event.currentTarget) {
				player.togglePlay();
			}
		}}
	>
		<div>
			<h2 class="text-2xl font-bold text-white drop-shadow-md">{mediaTitle}</h2>
			<p class="text-sm font-medium text-gray-300">Playing Now</p>
		</div>

		<div
			id="media-settings-menu"
			{@attach clickOutsideOfNode((event) => {
				const elementTarget = event.target as HTMLElement;
				// const settingsButton = document.getElementById('menu-settings');
				if (playerSettingsMenu?.contains(elementTarget)) return;

				isSettingsOpen = false;
			})}
			class={[
				'absolute right-6 bottom-26 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#15161c]/95 shadow-2xl backdrop-blur-2xl transition-all',
				!isSettingsOpen ? 'hidden' : '',
			]}
		>
			<div>
				<div class="flex items-center justify-between border-b border-white/5 bg-white/5 p-4">
					<h3 class="flex items-center gap-2 text-sm font-bold text-white">
						<Icon.Linear.SlidersVert class="size-4 fill-current" /> Settings
					</h3>
					<button class="text-gray-400 hover:text-white" onclick={() => (isSettingsOpen = !isSettingsOpen)}>
						<Icon.Linear.Cross class="size-5 fill-current" />
					</button>
				</div>

				<div class="space-y-1 p-2">
					<!-- General Settings -->
					<div class="px-3 py-2">
						<p class="mb-2 block text-[10px] font-bold tracking-wider text-gray-500 uppercase">General</p>
						<div class="space-y-1">
							<button
								class="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
								onclick={() => (autoPlay = !autoPlay)}
							>
								<span>Auto Play</span>
								<div
									class={[
										'relative h-5 w-9 rounded-full transition-colors',
										autoPlay ? 'bg-brand-primary-100' : 'bg-gray-600',
									]}
								>
									<div
										class={[
											'absolute top-1 left-1 h-3 w-3 rounded-full bg-white transition-transform',
											autoPlay ? 'translate-x-4' : 'translate-x-0',
										]}
									></div>
								</div>
							</button>
							<button
								class="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
								onclick={() => (autoNext = !autoNext)}
							>
								<span>Auto Next</span>
								<div
									class={[
										'relative h-5 w-9 rounded-full transition-colors',
										autoNext ? 'bg-brand-primary-100' : 'bg-gray-600',
									]}
								>
									<div
										class={[
											'absolute top-1 left-1 h-3 w-3 rounded-full bg-white transition-transform',
											autoNext ? 'translate-x-4' : 'translate-x-0',
										]}
									></div>
								</div>
							</button>
						</div>
					</div>

					<div class="mx-3 my-2 h-px bg-white/5"></div>

					<!-- Playback Speed Section -->
					<div class="px-3 py-2">
						<p class="mb-2 block text-[10px] font-bold tracking-wider text-gray-500 uppercase">Playback Speed</p>
						<div class="flex justify-between rounded-lg bg-black/20 p-1">
							<button
								class="speed-btn flex-1 rounded-md py-1.5 text-xs text-gray-400 transition-all hover:bg-white/5 hover:text-white"
							>
								0.5x
							</button>
							<button
								class="speed-btn flex-1 rounded-md bg-brand-primary-100 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
							>
								1x
							</button>
							<button
								class="speed-btn flex-1 rounded-md py-1.5 text-xs text-gray-400 transition-all hover:bg-white/5 hover:text-white"
							>
								1.5x
							</button>
							<button
								class="speed-btn flex-1 rounded-md py-1.5 text-xs text-gray-400 transition-all hover:bg-white/5 hover:text-white"
							>
								2x
							</button>
						</div>
					</div>

					<div class="mx-3 my-2 h-px bg-white/5"></div>

					<!-- Simple Subtitles List -->
					<div class="px-3 pb-2">
						<p class="mb-2 block text-[10px] font-bold tracking-wider text-gray-500 uppercase">Subtitles</p>
						<div class="space-y-1" id="subtitle-list">
							<!-- Off Button -->
							<div class="group flex items-center gap-1">
								<button
									onclick={() => subtitles.disable()}
									class={[
										'flex flex-1 cursor-pointer items-center justify-between rounded-lg p-2 text-left transition-colors',
										subtitles.activeLang === null
											? 'bg-brand-primary-100 text-white'
											: 'text-gray-400 hover:bg-white/5 hover:text-white',
									]}
								>
									<span class="text-sm font-medium">Off</span>
									{#if subtitles.activeLang === null}
										<Icon.Linear.Check class="size-4 fill-current" />
									{/if}
								</button>
							</div>

							<!-- Language Buttons -->
							{#each Object.entries(subtitles.data) as [langKey, langData] (langKey)}
								{@const isActive = subtitles.isLanguageActive(langKey as SubtitleLanguage)}
								<div class="group flex items-center gap-1">
									<button
										onclick={() => subtitles.selectLanguage(langKey as SubtitleLanguage)}
										class={[
											'flex flex-1 cursor-pointer items-center justify-between rounded-lg p-2 text-left transition-colors',
											isActive ? 'bg-brand-primary-100 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
										]}
									>
										<span class="text-sm font-medium">
											{langData.label}
											{#if langData.hasFetched && langData.sources.length === 0}
												<span class="ml-2 text-xs opacity-60">(No subs)</span>
											{/if}
										</span>
										{#if isActive}
											<Icon.Linear.Check class="size-4 fill-current" />
										{/if}
									</button>
									<button
										onclick={() => subtitles.openOptions(langKey as SubtitleLanguage)}
										class="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
										title="Options"
									>
										<Icon.Linear.SlidersHoriz class="size-4 fill-current" />
									</button>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Subtitle Options Sub-View -->
			<div
				id="settings-sub-options"
				class={[
					'view-slide absolute inset-0 flex flex-col bg-[#15161c] transition-transform duration-300',
					subtitles.optionsView ? 'translate-x-0' : 'translate-x-full',
				]}
			>
				<div class="flex items-center gap-3 border-b border-white/5 bg-white/5 p-4">
					<button
						onclick={() => subtitles.closeOptions()}
						class="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
					>
						<Icon.Linear.ChevronLeft class="size-5 fill-current" />
					</button>
					<h3 class="text-sm font-bold text-white">
						{subtitles.optionsViewData?.label ?? ''} Options
					</h3>
				</div>

				<div class="custom-scrollbar overflow-bar flex-1 space-y-6 overflow-y-auto p-4">
					<!-- Source Selector -->
					<div>
						<p class="mb-3 block text-[10px] font-bold tracking-wider text-gray-500 uppercase">Subtitle Source</p>
						<div class="space-y-2" id="sub-source-list">
							{#if subtitles.optionsViewData && subtitles.optionsViewData.sources.length === 0}
								<p class="text-sm text-gray-500">No subtitles available for this language</p>
							{:else if subtitles.optionsViewData && subtitles.optionsView}
								{#each subtitles.optionsViewData.sources as source, idx (source.id)}
									{@const isSourceActive = subtitles.optionsViewData.activeSourceIndex === idx}
									{@const sourceLabel = idx === 0 ? 'Best rated' : 'Fan Sub'}
									<button
										onclick={() => subtitles.activateSource(subtitles.optionsView!, idx)}
										class={[
											'flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 text-left text-sm font-medium transition-all',
											isSourceActive
												? 'border-brand-primary-90 bg-brand-primary-90/10 text-white'
												: 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10',
										]}
									>
										<span>Source {idx + 1} ({sourceLabel})</span>
										{#if isSourceActive}
											<div class="size-2 rounded-full bg-brand-primary-90 shadow-brand-primary-100"></div>
										{/if}
									</button>
								{/each}
							{/if}
						</div>
					</div>

					<!-- Sync Controls -->
					{#if subtitles.optionsView && subtitles.optionsViewData && subtitles.optionsViewData.activeSourceIndex !== null}
						{@const currentSource = subtitles.optionsViewData.sources[subtitles.optionsViewData.activeSourceIndex]}
						<div>
							<p class="mb-3 block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
								Sync Adjustment (Offset)
							</p>
							<div class="rounded-xl border border-white/5 bg-black/20 p-4">
								<div class="mb-4 flex items-center justify-between">
									<span class="text-xs text-gray-400">Timing</span>
									<span class="font-mono text-lg font-bold text-brand-primary-90">
										{subtitles.formatOffset(currentSource?.offsetMs ?? 0)}
									</span>
								</div>
								<div class="flex items-center justify-between gap-2">
									<button
										onclick={() => subtitles.adjustOffset(-100)}
										class="cursor-pointer rounded-lg border border-white/5 bg-white/5 p-2 text-gray-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
									>
										<Icon.Linear.Minus class="size-4 fill-current" />
									</button>
									<div class="relative mx-2 h-1 flex-1 overflow-hidden rounded-full bg-white/10">
										<div class="absolute inset-y-0 left-1/2 w-0.5 bg-white/20"></div>
										<div
											class="h-full bg-brand-primary-90 transition-all"
											style="width: {subtitles.syncBarWidth}%;"
										></div>
									</div>
									<button
										onclick={() => subtitles.adjustOffset(100)}
										class="cursor-pointer rounded-lg border border-white/5 bg-white/5 p-2 text-gray-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
									>
										<Icon.Linear.Plus class="size-4 fill-current" />
									</button>
								</div>
								<div class="mt-2 flex justify-between font-mono text-[10px] text-gray-600">
									<span>Earlier</span>
									<span>Later</span>
								</div>
							</div>
						</div>
					{:else}
						<div>
							<p class="mb-3 block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
								Sync Adjustment (Offset)
							</p>
							<p class="text-sm text-gray-500">Select a subtitle source to adjust timing</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Center Play Icon -->
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<div
				class="flex size-24 scale-50 items-center justify-center rounded-full border border-white/10 bg-white/10 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300"
			>
				<Icon.Filled.Play class="ml-1 h-10 w-10 fill-white text-white" />
			</div>
		</div>

		<!-- Bottom Controls -->
		<div class="space-y-4">
			<!-- Timeline -->
			<button
				aria-label="video-timeline"
				class="group relative h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-all duration-300 hover:h-2.5"
				onclick={handleTimelineClick}
			>
				<div
					class="relative top-0 left-0 h-full w-0 translate-y-0 rounded-full bg-brand-primary-100 transition-all"
					style="width: {player.progress}%;"
				>
					<div
						class="absolute top-1/2 -right-2.5 h-4 w-4 -translate-y-1/2 scale-0 rounded-full border-2 border-brand-primary-90 bg-white shadow-lg transition-transform group-hover:scale-100"
					></div>
				</div>
			</button>

			<!-- Control Bar -->
			<div class="flex items-center justify-between px-2">
				<div class="flex items-center gap-6">
					<button
						class="transform cursor-pointer text-white transition-colors hover:text-brand-primary-90 active:scale-90"
						onclick={() => player.togglePlay()}
					>
						{#if player.isPlaying}
							<Icon.Filled.Pause class="h-8 w-8 fill-current" />
						{:else}
							<Icon.Filled.Play class="h-8 w-8 fill-current" />
						{/if}
					</button>

					<div class="flex items-center gap-3">
						<button
							class="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
							onclick={() => player.jump(-10)}
						>
							<Icon.Linear.RotateCcw class="size-5 fill-current" />
						</button>
						<button
							class="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
							onclick={() => player.jump(10)}
						>
							<Icon.Linear.RotateCw class="size-5 fill-current" />
						</button>
					</div>

					<div class="volume-container group/vol flex items-center">
						<button class="rounded-full p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
							{#if (player.element && player.isMuted) || player.volume === 0}
								<Icon.Linear.VolumeMute class="size-5 fill-current" />
							{:else if player.volume > 0 && player.volume <= 0.5}
								<Icon.Linear.VolumeLow class="size-5 fill-current" />
							{:else}
								<Icon.Linear.VolumeHigh class="size-5 fill-current" />
							{/if}
						</button>
						<div
							class="flex w-0 items-center overflow-hidden opacity-0 transition-all duration-300 group-hover/vol:ml-2 group-hover/vol:w-20 group-hover/vol:opacity-100"
						>
							<input
								oninput={(event) => player.setVolume(parseFloat((event.currentTarget as HTMLInputElement).value))}
								type="range"
								min="0"
								max="1"
								step="0.05"
								value={player.volume}
								class={[
									'h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20',
									'[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer',
									'[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-primary-90',
								]}
							/>
						</div>
					</div>

					<div class="font-mono text-xs font-bold tracking-widest text-gray-400">
						<span id="cinema-current-time" class="text-white">{player.formattedCurrent}</span>
						<span class="mx-1 text-gray-600">/</span>
						<span id="cinema-duration">{player.formattedDuration}</span>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<!-- New Settings Location -->
					<button
						bind:this={playerSettingsMenu}
						onclick={() => (isSettingsOpen = !isSettingsOpen)}
						class="group relative cursor-pointer rounded-full p-2.5 text-gray-300 transition-all hover:bg-white/10 hover:text-white"
					>
						<Icon.Linear.Gear class="size-5 fill-current transition-transform duration-500 group-hover:rotate-45" />
					</button>

					<button
						class="cursor-pointer rounded-full p-2.5 text-gray-300 transition-all hover:bg-white/10 hover:text-white"
						onclick={toggleFullscreen}
					>
						<Icon.Linear.Maximize class="size-5 fill-current" />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	#media-player::-webkit-media-controls {
		display: none !important;
	}
	#media-player::-webkit-media-controls-enclosure {
		display: none !important;
	}

	#media-settings-menu {
		transition:
			display 0.3s allow-discrete,
			opacity 0.3s ease-out,
			transform 0.3s ease-out;

		opacity: 1;
		transform: translateY(0);

		@starting-style {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	#media-settings-menu.hidden {
		display: none;
		opacity: 0;
		transform: translateY(20px);
	}

	#media-settings-menu.hidden {
		display: none;
		opacity: 0;
		transform: translateY(20px);
	}
</style>
