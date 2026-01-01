import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { srtToVtt } from '$lib/features/subtitles/subtitles';
import { gunzipSync } from 'zlib';

export const GET: RequestHandler = async ({ url }) => {
	const downloadUrl = url.searchParams.get('url');

	if (!downloadUrl) {
		throw error(400, 'Missing url parameter');
	}

	try {
		// OpenSubtitles download links return gzipped files
		const response = await fetch(downloadUrl, {
			headers: {
				'User-Agent': 'TemporaryUserAgent',
				'Accept-Encoding': 'gzip',
			},
		});

		if (!response.ok) {
			throw error(response.status, `Failed to download subtitle: ${response.statusText}`);
		}

		// Get the raw buffer
		const buffer = await response.arrayBuffer();
		let subtitleText: string;

		try {
			// Try to decompress (OpenSubtitles typically returns gzipped content)
			const decompressed = gunzipSync(Buffer.from(buffer));
			subtitleText = decompressed.toString('utf-8');
		} catch {
			// If decompression fails, try using the content as-is
			subtitleText = new TextDecoder('utf-8').decode(buffer);
		}

		// Convert SRT to VTT
		const vttContent = srtToVtt(subtitleText);

		return new Response(vttContent, {
			headers: {
				'Content-Type': 'text/vtt; charset=utf-8',
				'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
			},
		});
	} catch (err) {
		// console.error('Subtitle download error:', err);
		// if (err instanceof Error && 'status' in err) {
		// 	throw err;
		// }
		throw error(500, 'Failed to download and convert subtitle');
	}
};
