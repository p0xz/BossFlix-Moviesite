import Hls from 'hls.js';
import { onDestroy, onMount } from 'svelte';

export class VideoController {
	element = $state<HTMLVideoElement | null>(null);
	hls: Hls | null = null;

	// State
	isPlaying = $state(false);
	currentTime = $state(0);
	duration = $state(0);
	volume = $state(0.5);
	isMuted = $state(false);

	progress = $derived(this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0);
	formattedCurrent = $derived(VideoController.#formatTime(this.currentTime));
	formattedDuration = $derived(VideoController.#formatTime(this.duration));

	static #formatTime(seconds: number) {
		if (!Number.isFinite(seconds) || isNaN(seconds)) return '00:00';
		return new Date(seconds * 1000).toISOString().substring(14, 19);
	}

	constructor() {
		onDestroy(() => this.destroyHls());
	}

	initHls(videoUrl: string) {
		if (!this.element) return;

		if (Hls.isSupported()) {
			this.destroyHls();
			this.hls = new Hls({ enableWorker: true, backBufferLength: 90 });
			this.hls.loadSource(videoUrl);
			this.hls.attachMedia(this.element);
			this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
				if (this.isPlaying) this.element?.play();
			});
			return;
		}
		if (this.element.canPlayType('application/vnd.apple.mpegurl')) {
			this.element.src = videoUrl;
		}
	}

	destroyHls() {
		if (this.hls) {
			this.hls.destroy();
			this.hls = null;
		}
	}

	togglePlay() {
		if (!this.element) return;

		if (this.element.paused) {
			this.element.play();
		} else {
			this.element.pause();
		}
	}

	seek(percent: number) {
		if (!this.element || !Number.isFinite(this.duration)) return;
		this.element.currentTime = (percent / 100) * this.duration;
	}

	jump(seconds: number) {
		if (!this.element) return;
		this.element.currentTime += seconds;
	}

	setVolume(vol: number) {
		if (!this.element) return;
		this.volume = vol;
		this.element.volume = vol;
		this.element.muted = this.isMuted = vol === 0;
	}

	onTimeUpdate = () => {
		if (!this.element) return;
		this.currentTime = this.element.currentTime;
	};

	onDurationChange = () => {
		if (!this.element) return;
		this.duration = this.element.duration;
	};

	onPlayPause = () => {
		if (!this.element) return;
		this.isPlaying = !this.element.paused;
	};
}
