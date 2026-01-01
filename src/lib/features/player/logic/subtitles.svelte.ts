import type { SubtitleLanguage } from '$lib/features/subtitles/subtitles';
import type { SubtitleLanguageData, SubtitlesState } from '$lib/features/subtitles/types';

// Represents a single subtitle cue
interface SubtitleCue {
	startTime: number; // in seconds
	endTime: number; // in seconds
	text: string;
}

export class SubtitleController {
	// State
	data = $state<SubtitlesState>({
		eng: { label: 'English', activeSourceIndex: null, sources: [], isLoading: false, hasFetched: false },
		ger: { label: 'German', activeSourceIndex: null, sources: [], isLoading: false, hasFetched: false },
		spa: { label: 'Spanish', activeSourceIndex: null, sources: [], isLoading: false, hasFetched: false },
		fre: { label: 'French', activeSourceIndex: null, sources: [], isLoading: false, hasFetched: false },
	});

	activeLang = $state<SubtitleLanguage | null>(null);
	optionsView = $state<SubtitleLanguage | null>(null);
	currentVttUrl = $state<string | null>(null);
	
	// Custom subtitle rendering
	currentText = $state<string>('');
	private cues: SubtitleCue[] = [];

	// Media info for API calls
	private imdbId: string | undefined;
	private season: number | undefined;
	private episode: number | undefined;

	constructor(imdbId?: string, season?: number, episode?: number) {
		this.imdbId = imdbId;
		this.season = season;
		this.episode = episode;
	}

	updateMediaInfo(imdbId?: string, season?: number, episode?: number) {
		this.imdbId = imdbId;
		this.season = season;
		this.episode = episode;
	}

	// Computed
	get optionsViewData(): SubtitleLanguageData | null {
		return this.optionsView ? this.data[this.optionsView] : null;
	}

	get activeSourceOffset(): number {
		if (!this.activeLang) return 0;
		const langData = this.data[this.activeLang];
		if (langData.activeSourceIndex === null) return 0;
		return langData.sources[langData.activeSourceIndex]?.offsetMs ?? 0;
	}

	get syncBarWidth(): number {
		const maxOffset = 20000;
		return Math.min(100, Math.max(0, ((this.activeSourceOffset + maxOffset) / (maxOffset * 2)) * 100));
	}

	// Parse VTT timestamp to seconds
	private parseTimestamp(timestamp: string): number {
		const parts = timestamp.trim().split(':');
		let hours = 0, minutes = 0, seconds = 0;
		
		if (parts.length === 3) {
			hours = parseFloat(parts[0]);
			minutes = parseFloat(parts[1]);
			seconds = parseFloat(parts[2].replace(',', '.'));
		} else if (parts.length === 2) {
			minutes = parseFloat(parts[0]);
			seconds = parseFloat(parts[1].replace(',', '.'));
		}
		
		return hours * 3600 + minutes * 60 + seconds;
	}

	// Parse VTT content to extract cues
	private parseVtt(vttContent: string): SubtitleCue[] {
		const cues: SubtitleCue[] = [];
		const lines = vttContent.split('\n');
		
		let i = 0;
		// Skip header (WEBVTT and any metadata)
		while (i < lines.length && !lines[i].includes('-->')) {
			i++;
		}

		while (i < lines.length) {
			const line = lines[i].trim();
			
			// Look for timestamp line (contains -->)
			if (line.includes('-->')) {
				const [startStr, endStr] = line.split('-->').map(s => s.trim().split(' ')[0]);
				const startTime = this.parseTimestamp(startStr);
				const endTime = this.parseTimestamp(endStr);
				
				// Collect text lines until empty line or next timestamp
				const textLines: string[] = [];
				i++;
				while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
					// Skip numeric cue identifiers
					if (!/^\d+$/.test(lines[i].trim())) {
						textLines.push(lines[i].trim());
					}
					i++;
				}
				
				if (textLines.length > 0) {
					// Remove VTT tags like <b>, </b>, <i>, </i>, etc.
					const text = textLines.join('\n').replace(/<[^>]+>/g, '');
					cues.push({ startTime, endTime, text });
				}
			} else {
				i++;
			}
		}
		
		return cues;
	}

	private lastVideoTime = 0;

	// Update current subtitle text based on video time
	updateCurrentTime(currentTimeSeconds: number): void {
		this.lastVideoTime = currentTimeSeconds; // Store for offset adjustment updates

		if (!this.activeLang || this.cues.length === 0) {
			this.currentText = '';
			return;
		}

		// Apply offset (convert ms to seconds)
		const adjustedTime = currentTimeSeconds - (this.activeSourceOffset / 1000);

		// Find matching cue
		const activeCue = this.cues.find(
			cue => adjustedTime >= cue.startTime && adjustedTime <= cue.endTime
		);

		this.currentText = activeCue?.text ?? '';
	}

	// Actions
	async fetchSources(langKey: SubtitleLanguage): Promise<void> {
		if (!this.imdbId) return;

		const langData = this.data[langKey];
		if (langData.hasFetched) return;

		try {
			const params = new URLSearchParams({ imdbId: this.imdbId, language: langKey });
			if (this.season) params.set('season', this.season.toString());
			if (this.episode) params.set('episode', this.episode.toString());

			const response = await fetch(`/api/subtitles?${params}`);
			if (!response.ok) throw new Error('Failed to fetch subtitles');

			const result = await response.json();

			this.data[langKey].sources = result.sources.map(
				(s: { id: string; name: string; downloadUrl: string; downloads: number; rating: string }) => ({
					id: s.id,
					name: s.name,
					downloadUrl: s.downloadUrl,
					downloads: s.downloads,
					rating: s.rating,
					offsetMs: 0,
					vttUrl: undefined,
					vttContent: undefined,
					isLoading: false,
				}),
			);
			this.data[langKey].hasFetched = true;
		} catch (err) {
			console.error('Failed to fetch subtitle sources:', err);
		}
	}

	async activateSource(langKey: SubtitleLanguage, sourceIndex: number): Promise<void> {
		const langData = this.data[langKey];
		const source = langData.sources[sourceIndex];
		if (!source) return;

		// If VTT is already downloaded, just activate it
		if (source.vttUrl && source.vttContent) {
			this.data[langKey].activeSourceIndex = sourceIndex;
			this.activeLang = langKey;
			this.currentVttUrl = source.vttUrl;
			this.cues = this.parseVtt(source.vttContent);
			return;
		}

		// Download and convert to VTT
		try {
			const response = await fetch(`/api/subtitles/download?url=${encodeURIComponent(source.downloadUrl)}`);
			if (!response.ok) throw new Error('Failed to download subtitle');

			const vttContent = await response.text();

			// Create blob URL
			const blob = new Blob([vttContent], { type: 'text/vtt' });
			const vttUrl = URL.createObjectURL(blob);

			// Store both URL and content
			this.data[langKey].sources[sourceIndex].vttUrl = vttUrl;
			this.data[langKey].sources[sourceIndex].vttContent = vttContent;
			this.data[langKey].activeSourceIndex = sourceIndex;
			this.activeLang = langKey;
			this.currentVttUrl = vttUrl;
			
			// Parse cues for custom rendering
			this.cues = this.parseVtt(vttContent);
		} catch (err) {
			console.error('Failed to download subtitle:', err);
		}
	}

	disable(): void {
		if (this.activeLang) {
			this.data[this.activeLang].activeSourceIndex = null;
		}
		this.activeLang = null;
		this.currentVttUrl = null;
		this.currentText = '';
		this.cues = [];
	}

	async selectLanguage(langKey: SubtitleLanguage): Promise<void> {
		const langData = this.data[langKey];

		// Fetch sources if not already fetched
		if (!langData.hasFetched) {
			await this.fetchSources(langKey);
		}

		// Get updated data after fetch
		const updatedLangData = this.data[langKey];

		// If this language is already active, do nothing (don't toggle off)
		if (this.activeLang === langKey && updatedLangData.activeSourceIndex !== null) {
			return;
		}

		// If has sources, activate first source
		if (updatedLangData.sources.length > 0) {
			await this.activateSource(langKey, 0);
		}
	}

	openOptions(langKey: SubtitleLanguage): void {
		// Fetch if not already fetched
		if (!this.data[langKey].hasFetched) {
			this.fetchSources(langKey);
		}
		this.optionsView = langKey;
	}

	closeOptions(): void {
		this.optionsView = null;
	}

	adjustOffset(delta: number): void {
		if (!this.activeLang) return;
		const langData = this.data[this.activeLang];
		if (langData.activeSourceIndex === null) return;

		const currentOffset = langData.sources[langData.activeSourceIndex].offsetMs;
		const newOffset = Math.max(-20000, Math.min(20000, currentOffset + delta));
		this.data[this.activeLang].sources[langData.activeSourceIndex].offsetMs = newOffset;
		
		// Immediately update the displayed subtitle
		this.updateCurrentTime(this.lastVideoTime);
	}

	formatOffset(ms: number): string {
		const sign = ms >= 0 ? '+' : '';
		return `${sign}${ms}ms`;
	}

	isLanguageActive(langKey: SubtitleLanguage): boolean {
		return this.activeLang === langKey && this.data[langKey].activeSourceIndex !== null;
	}
}
