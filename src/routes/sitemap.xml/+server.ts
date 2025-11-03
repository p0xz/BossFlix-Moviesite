import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString();

	const sitemap: string = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset
            xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

        <url>
        <loc>https://bossflix.org/</loc>
        <lastmod>${lastmod}</lastmod>
        </url>

        </urlset>
    `.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
};
