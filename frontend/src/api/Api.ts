import axios from 'axios';

export interface ApiInterface {
	performGetRequest(endpoint: string): Promise<any>;
	performPostRequest(endpoint: string, body: any): Promise<any>;
}

export default class Api implements ApiInterface {
	private readonly apiUrl: string;

	constructor(apiUrl: string) {
		this.apiUrl = apiUrl;
	}

	async performGetRequest(endpoint: string): Promise<any> {
		try {
			return await axios.get(`${this.apiUrl}${endpoint}`);
		} catch (e) {
			throw e;
		}
	}

	async performPostRequest(endpoint: string, body: any): Promise<any> {
		try {
			return await axios.post(`${this.apiUrl}${endpoint}`, body);
		} catch (e) {
			throw e;
		}
	}
}
