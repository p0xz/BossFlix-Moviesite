export class VidSrcAdapter {
	static decodeBase64(encodedStr: string): string {
		const reversedStr = encodedStr.split('').reverse().join('');

		// Standardize Base64 characters (fix)
		const validBase64 = reversedStr.replace(/-/g, '+').replace(/_/g, '/');

		// Decode Base64 and Decrypt Caesar Cipher (-3)
		const decrypted = atob(validBase64)
			.split('')
			.map((c) => String.fromCharCode(c.charCodeAt(0) - 3))
			.join('');

		/**
		 * The templates might look like this: https://tmstr2.{v1}/pl/H4sIAAAAAAAAAw3MWXKCMAAA0CtlVekn with {v1} as a placeholder for domains.
		 * So I will just pick the public known to me domain "thrumbleandjaxon.com" to replace {v1}.
		 */
		const templates = decrypted.split(' or ');
		const bestTemplate = templates.find((t) => t.includes('{v1}')) || templates[0];

		const finalUrl = bestTemplate?.replace(/\{v\d+\}/, 'thrumbleandjaxon.com');

		return finalUrl || '';
	}
}
