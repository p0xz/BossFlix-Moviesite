export class ImdbError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ImdbError';
	}
}
