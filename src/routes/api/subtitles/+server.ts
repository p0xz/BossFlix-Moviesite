import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SubtitleBuilder, type SubtitleLanguage } from '$lib/features/subtitles/subtitles';
import type { OpenSubtitles } from '$lib/features/subtitles/types';

export const GET: RequestHandler = async ({ url }) => {
	const imdbId = url.searchParams.get('imdbId');
	const language = (url.searchParams.get('language') ?? 'eng') as SubtitleLanguage;
	const season = url.searchParams.get('season');
	const episode = url.searchParams.get('episode');

	if (!imdbId) {
		throw error(400, 'Missing imdbId parameter');
	}

	try {
		let apiUrl: string;

		if (season && episode) {
			// Series
			apiUrl = SubtitleBuilder.getSeriesOrigin(imdbId, parseInt(season), parseInt(episode), language);
		} else {
			// Movie
			apiUrl = SubtitleBuilder.getMovieOrigin(imdbId, language);
		}

		const response = await fetch(apiUrl, {
			headers: {
				'User-Agent': 'TemporaryUserAgent',
				'X-User-Agent': 'TemporaryUserAgent',
			},
		});

		if (!response.ok) {
			throw error(response.status, `OpenSubtitles API error: ${response.statusText}`);
		}

		const subtitles: OpenSubtitles[] = await response.json();

		// Map to simplified format for the client
		const sources = subtitles.map((sub) => ({
			id: sub.IDSubtitleFile,
			name: sub.MovieReleaseName || sub.SubFileName,
			downloadUrl: sub.SubDownloadLink,
			downloads: parseInt(sub.SubDownloadsCnt) || 0,
			rating: sub.SubRating,
		}));

		// Sort by downloads (popularity)
		sources.sort((a, b) => b.downloads - a.downloads);

		return json({
			language,
			sources: sources.slice(0, 20), // Limit to top 20 sources
		});
	} catch (err) {
		console.error('Subtitle fetch error:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to fetch subtitles');
	}
};
