import axios, { AxiosInstance } from 'axios';

export interface ApiInterface {
	performGetRequest(endpoint: string, query: string | null, token?: string): Promise<any>;
	performPostRequest(endpoint: string, body: any): Promise<any>;
}

export default class Api implements ApiInterface {
	private readonly apiUrl: string;
	private axiosInstance: AxiosInstance;
	private axiosConfig = { headers: { 'Access-Control-Allow-Origin': '*' } };

	constructor(apiUrl: string) {
		this.apiUrl = apiUrl;
		this.axiosInstance = axios.create();
	}

	async performGetRequest(endpoint: string, query: string | null, token?: string): Promise<any> {
		try {
			debugger;
			return await this.axiosInstance.get(
				`${this.apiUrl}${endpoint}`,
				token
					? {
							headers: { Authorization: `Bearer ${token}`, ...this.axiosConfig.headers }
					  }
					: {}
			);
		} catch (e) {
			throw e;
		}
	}

	async performPostRequest(endpoint: string, body: any, token?: string): Promise<any> {
		try {
			return await this.axiosInstance.post(
				`${this.apiUrl}${endpoint}`,
				body,
				token
					? {
							headers: { Authorization: `Bearer ${token}`, ...this.axiosConfig.headers }
					  }
					: {}
			);
		} catch (e) {
			throw e;
		}
	}
}
