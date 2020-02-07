import axios, { AxiosInstance } from 'axios';

export interface ApiInterface {
	performGetRequest(endpoint: string): Promise<any>;
	performPostRequest(endpoint: string, body: any): Promise<any>;
}

export default class Api implements ApiInterface {
	private readonly apiUrl: string;
	private axiosInstance: AxiosInstance;

	constructor(apiUrl: string) {
		this.apiUrl = apiUrl;
		this.axiosInstance = axios.create();
	}

	async performGetRequest(endpoint: string, token?: string): Promise<any> {
		try {
			return await this.axiosInstance.get(`${this.apiUrl}${endpoint}`);
		} catch (e) {
			throw e;
		}
	}

	async performPostRequest(endpoint: string, body: any): Promise<any> {
		try {
			return await this.axiosInstance.post(`${this.apiUrl}${endpoint}`, body);
		} catch (e) {
			throw e;
		}
	}
}
