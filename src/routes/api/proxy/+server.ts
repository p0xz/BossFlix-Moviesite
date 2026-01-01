import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { VidSrcAdapter } from '$lib/server/providers/sources/vidsrc.adapter';
import { parseM3u8 } from '$lib/server/utils/m3u8';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return json({ error: 'No url provided' }, { status: 400 });
	}

	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
		'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Content-Type',
	};

	try {
		const response = await fetch(targetUrl, {
			headers: {
				Referer: 'https://cloudnestra.com/',
				Origin: 'https://cloudnestra.com',
				Accept: '*/*',
				'Accept-Language': 'en-US,en;q=0.9',
			},
		});

		const contentType = response.headers.get('content-type');

		if (
			targetUrl.includes('.m3u8') ||
			(contentType && (contentType.includes('mpegurl') || contentType.includes('hls')))
		) {
			const m3u8Content = await response.text();
			const baseUrl =
				new URL(targetUrl).origin +
				new URL(targetUrl).pathname.substring(0, new URL(targetUrl).pathname.lastIndexOf('/'));

			const modifiedM3u8 = m3u8Content.replace(/^(?!#)(.+)$/gm, (match) => {
				let segmentUrl = match.trim();

				// Handle relative URLs
				if (!segmentUrl.startsWith('http')) {
					segmentUrl = new URL(segmentUrl, baseUrl).href;
				}

				// Return the proxied URL
				// We encode the segment URL to pass it as a parameter
				return `http://localhost:5173/api/proxy?url=${encodeURIComponent(segmentUrl)}`;
			});

			return new Response(modifiedM3u8, {
				headers: {
					'Content-Type': 'application/vnd.apple.mpegurl',
					'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
					'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Content-Type',
				},
			});
		}

		const responseHeaders = new Headers(corsHeaders);

		// Copy relevant headers from the response
		response.headers.forEach((value, name) => {
			const lowerName = name.toLowerCase();
			if (!['connection', 'transfer-encoding', 'access-control-allow-origin', 'content-encoding'].includes(lowerName)) {
				responseHeaders.set(name, value);
			}
		});

		// Return the proxied response
		return new Response(response.body, {
			status: response.status,
			headers: responseHeaders,
		});
	} catch (error) {
		return json(
			{ error: 'Failed to fetch or process the m3u8 or segment file' },
			{ status: 500, headers: corsHeaders },
		);
	}

	// return json({}, { status: 200 });
};
