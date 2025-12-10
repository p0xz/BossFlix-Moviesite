import type { ImdbConnection, ImdbImage } from '$lib/graphql/types/responses';

const DEFAULT_WIDTHS = [320, 480, 640, 768, 960, 1024, 1280, 1920, 2560, 3840];

export function getResizedImage(url: string | undefined, width = 640, quality = 75): string {
	if (!url) return '';

	if (!url.includes('media-amazon.com')) return url;

	// Example match: "_V1_QL75_UX90_CR0,0,90,133_.jpg"
	const pattern = /_V1_.*(\.[a-zA-Z]+)$/;

	// _V1_ : Version flag
	// QL{quality} : Compression quality
	// UX{width} : Resize to specific width (maintaining aspect ratio)
	// $1 : The original file extension (e.g. ".jpg") captured from the regex
	const newParams = `_V1_QL${quality}_UX${width}_$1`;

	if (pattern.test(url)) {
		return url.replace(pattern, newParams);
	}

	return url;
}

export function generateImageSrcset(url: string | undefined, widths: number[] = DEFAULT_WIDTHS): string {
	if (!url) return '';

	if (!url.includes('media-amazon.com')) return '';

	return widths.map((width) => `${getResizedImage(url, width)} ${width}w`).join(', ');
}

export function getResponsiveImage(url: string | undefined, defaultWidth = 640) {
	return {
		src: getResizedImage(url, defaultWidth),
		srcset: generateImageSrcset(url),
	};
}

/**
 * Utility functions for selecting and filtering IMDb images
 * Use these to find the best horizontal/backdrop images for your homepage
 */

export interface ImageNode {
	id?: string;
	url: string;
	width: number;
	height: number;
	type?: string;
	caption?: {
		plainText?: string;
	};
}

export interface ImageEdge {
	node: ImageNode;
}

export interface ImagesData {
	total?: number;
	edges: ImageEdge[];
}

/**
 * Calculate aspect ratio from image dimensions
 */
export function getAspectRatio(image: ImdbImage): number {
	if (!image.width || !image.height) return 0;
	return image.width / image.height;
}

/**
 * Check if an image is horizontal/landscape
 * Horizontal images have aspect ratio >= 1.5 (e.g., 16:9 = 1.78, 2:1 = 2.0)
 */
export function isHorizontalImage(image: ImdbImage, minAspectRatio = 1.5): boolean {
	return getAspectRatio(image) >= minAspectRatio;
}

/**
 * Check if an image is vertical/portrait
 * Vertical images have aspect ratio <= 0.75 (e.g., 2:3 = 0.67)
 */
export function isVerticalImage(image: ImageNode, maxAspectRatio = 0.75): boolean {
	return getAspectRatio(image) <= maxAspectRatio;
}

/**
 * Check if an image is a still frame (horizontal scene image)
 * IMDb uses type: "still_frame" for horizontal images from movies/shows
 */
export function isStillFrame(image: ImdbImage): boolean {
	return image.type === 'still_frame';
}

/**
 * Calculate a quality score for an image based on available metadata
 * Since IMDb doesn't provide rating/quality fields, we score based on:
 * - Image dimensions (larger = better quality)
 * - Aspect ratio preference
 */
export function calculateImageScore(image: ImdbImage, preferredAspectRatio?: number): number {
	let score = 0;

	// Resolution score: larger images are better quality
	// Typical ranges: 1920x1080 = 2,073,600 pixels
	if (image.width && image.height) {
		const pixels = image.width * image.height;
		// Score from 0-100 based on pixel count
		score += Math.min(pixels / 50_000, 100);
	}

	// Aspect ratio preference bonus
	if (preferredAspectRatio && image.width && image.height) {
		const actualRatio = getAspectRatio(image);
		const ratioDiff = Math.abs(actualRatio - preferredAspectRatio);
		// Give up to 50 points for matching preferred aspect ratio
		score += Math.max(0, 50 - ratioDiff * 20);
	}

	return score;
}

/**
 *
 * Example usage:
 * @example
 * // In your component or server function:
 * const title = await fetchTitle('tt0111161');
 *
 * const bestBackdrop = getBestHorizontalImage(title.images, {
 *   minAspectRatio: 1.6,       // Wide format images
 *   preferredAspectRatio: 1.78, // Perfect for 16:9 displays
 *   minWidth: 1280,             // HD quality minimum
 *   minHeight: 720,
 * });
 *
 * const backdropUrl = bestBackdrop?.url || title.primaryImage?.url;
 *
 * // Or get multiple options:
 * const allBackdrops = getHorizontalImagesSorted(title.images, 1.5, 16/9);
 * const backdropUrl = allBackdrops[0]?.url || title.primaryImage?.url;
 */
export function getBestHorizontalImage(
	imagesData: ImdbConnection<ImdbImage>,
	options: {
		minAspectRatio?: number;
		preferredAspectRatio?: number; // e.g., 16/9 = 1.78
		minWidth?: number;
		minHeight?: number;
		filterStillFrames?: boolean;
	} = {},
): ImdbImage | null {
	const {
		minAspectRatio = 1.5,
		preferredAspectRatio = 16 / 9,
		minWidth = 1000,
		minHeight = 500,
		filterStillFrames = true,
	} = options;

	// Filter for horizontal images
	const horizontalImages = imagesData.edges
		.map((edge) => edge.node)
		.filter((img) => {
			if (!img.width || !img.height) return false;

			if (filterStillFrames && !isStillFrame(img)) return false;

			if (!isHorizontalImage(img, minAspectRatio)) return false;

			if (minWidth && img.width < minWidth) return false;
			if (minHeight && img.height < minHeight) return false;

			return true;
		});

	if (horizontalImages.length === 0) return null;

	// Score and sort images
	const scoredImages = horizontalImages.map((img) => ({
		image: img,
		score: calculateImageScore(img, preferredAspectRatio),
	}));

	scoredImages.sort((a, b) => b.score - a.score);

	return scoredImages[0].image;
}

/**
 * Find the best vertical/poster image from a collection
 */
export function getBestVerticalImage(
	imagesData: ImagesData,
	options: {
		maxAspectRatio?: number;
		preferredAspectRatio?: number; // e.g. 2/3
		minWidth?: number;
		minHeight?: number;
	} = {},
): ImageNode | null {
	const { maxAspectRatio = 0.75, preferredAspectRatio = 2 / 3, minWidth = 300, minHeight = 400 } = options;

	const verticalImages = imagesData.edges
		.map((edge) => edge.node)
		.filter((img) => {
			if (!isVerticalImage(img, maxAspectRatio)) return false;
			if (minWidth && img.width < minWidth) return false;
			if (minHeight && img.height < minHeight) return false;
			return true;
		});

	if (verticalImages.length === 0) return null;

	const scoredImages = verticalImages.map((img) => ({
		image: img,
		score: calculateImageScore(img, preferredAspectRatio),
	}));

	scoredImages.sort((a, b) => b.score - a.score);

	return scoredImages[0].image;
}

export function getHorizontalImagesSorted(
	imagesData: ImagesData,
	minAspectRatio = 1.5,
	preferredAspectRatio = 16 / 9,
): ImageNode[] {
	const horizontalImages = imagesData.edges
		.map((edge) => edge.node)
		.filter((img) => isHorizontalImage(img, minAspectRatio));

	return horizontalImages
		.map((img) => ({ image: img, score: calculateImageScore(img, preferredAspectRatio) }))
		.sort((a, b) => b.score - a.score)
		.map((item) => item.image);
}
