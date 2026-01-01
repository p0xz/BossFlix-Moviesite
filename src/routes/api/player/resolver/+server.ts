import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { VidSrcAdapter } from '$lib/server/providers/sources/vidsrc.adapter';
import { parseM3u8 } from '$lib/server/utils/m3u8';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		json({ error: 'Missing url parameter' }, { status: 400 });
	}

	try {
		const videoUrl = await VidSrcAdapter.requestNativeVideoUrl(targetUrl as string);

		const embedSourceDomain = 'https://' + new URL(videoUrl).hostname;
		const embedSourceList = await fetch(videoUrl).then((res) => res.text());
		const highResolutionVariant = parseM3u8(embedSourceList).variants[0].url;

		// console.log(embedSourceDomain + highResolutionVariant);

		// const _indexM3u8 = await fetch(embedSourceDomain + highResolutionVariant).then((res) => res.text());
		// console.log(_indexM3u8);

		// const proxifiedM3u8 = _indexM3u8.replace(/^(?!#)(.+)$/gm, (match) => {
		// 	let segmentUrl = match.trim();

		// 	// Handle relative URLs
		// 	if (!segmentUrl.startsWith('http')) {
		// 		segmentUrl = new URL(segmentUrl, baseUrl).href;
		// 	}

		// 	// Return the proxied URL
		// 	// We encode the segment URL to pass it as a parameter
		// 	return `http://localhost:${PORT}/api/proxy?url=${encodeURIComponent(segmentUrl)}`;
		// });

		return json({ videoUrl: embedSourceDomain + highResolutionVariant });
	} catch (error) {
		return json({ error: 'Failed to fetch video URL' }, { status: 500 });
	}
};
