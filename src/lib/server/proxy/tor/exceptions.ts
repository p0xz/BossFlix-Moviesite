export class TorProxyError extends Error {
	constructor(message: string, options: ErrorOptions = {}) {
		super(message, options);
		this.name = 'TorProxyError';
	}
}
