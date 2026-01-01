export interface M3u8Variant {
	bandwidth: number;
	resolution?: string;
	url: string;
}

export interface M3u8ParserResult {
	variants: M3u8Variant[];
	isMasterPlaylist: boolean;
}

export function parseM3u8(content: string): M3u8ParserResult {
	const lines = content.split(/\r?\n/);
	const variants: M3u8Variant[] = [];

	let currentAttributes: any = {};
	let isMaster = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		if (line.startsWith('#EXT-X-STREAM-INF:')) {
			isMaster = true;
			const attributesLine = line.substring(18);
			currentAttributes = parseAttributes(attributesLine);
		} else if (!line.startsWith('#') && isMaster && currentAttributes.BANDWIDTH) {
			variants.push({
				bandwidth: parseInt(currentAttributes.BANDWIDTH, 10),
				resolution: currentAttributes.RESOLUTION,
				url: line,
			});
			currentAttributes = {};
		}
	}

	return {
		variants: variants.sort((a, b) => b.bandwidth - a.bandwidth), // Sort best quality first
		isMasterPlaylist: isMaster,
	};
}

function parseAttributes(line: string): Record<string, string> {
	const result: Record<string, string> = {};
	const regex = /([A-Z0-9-]+)=(".*?"|[^,]+)/g;
	let match;

	while ((match = regex.exec(line)) !== null) {
		const key = match[1];
		let value = match[2];

		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1);
		}

		result[key] = value;
	}

	return result;
}
