// English, German, Spanish, French
export type SubtitleLanguage = 'eng' | 'ger' | 'spa' | 'fre';

export const SUBTITLE_LANGUAGES: Record<SubtitleLanguage, string> = {
	eng: 'English',
	ger: 'German',
	spa: 'Spanish',
	fre: 'French',
};

export class SubtitleBuilder {
	/**
	 * Build OpenSubtitles API URL for series
	 * @param language Must be an ISO 693-2 | ISO 639-3 code
	 */
	static getSeriesOrigin(imdbId: string, season: number, episode: number, language: SubtitleLanguage = 'eng') {
		const cleanId = imdbId.startsWith('tt') ? imdbId.slice(2) : imdbId;
		return `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanId}/season-${season}/sublanguageid-${language}`;
	}

	/**
	 * Build OpenSubtitles API URL for movies
	 * @param language Must be an ISO 693-2 | ISO 639-3 code
	 */
	static getMovieOrigin(imdbId: string, language: SubtitleLanguage = 'eng') {
		const cleanId = imdbId.startsWith('tt') ? imdbId.slice(2) : imdbId;
		return `https://rest.opensubtitles.org/search/imdbid-${cleanId}/sublanguageid-${language}`;
	}

	/**
	 * @deprecated Use getSeriesOrigin instead
	 */
	static getOrigin(imdbId: string, season: number, episode: number, language: SubtitleLanguage = 'eng') {
		return SubtitleBuilder.getSeriesOrigin(imdbId, season, episode, language);
	}
}

/**
 * Convert SRT subtitle format to VTT format
 */
export function srtToVtt(srt: string): string {
	// VTT header
	let vtt = 'WEBVTT\n\n';

	// Normalize line endings
	const normalized = srt.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

	// Split into subtitle blocks
	const blocks = normalized.trim().split(/\n\n+/);

	for (const block of blocks) {
		const lines = block.split('\n');
		if (lines.length < 2) continue;

		// Find the timing line (contains ' --> ')
		let timingLineIndex = -1;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes(' --> ')) {
				timingLineIndex = i;
				break;
			}
		}

		if (timingLineIndex === -1) continue;

		// Convert SRT timing format (00:00:00,000) to VTT format (00:00:00.000)
		const timing = lines[timingLineIndex].replace(/,/g, '.');

		// Get the text lines (everything after timing)
		const textLines = lines.slice(timingLineIndex + 1).join('\n');

		if (textLines.trim()) {
			vtt += `${timing}\n${textLines}\n\n`;
		}
	}

	return vtt;
}
