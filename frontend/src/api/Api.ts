import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs, { ParsedUrlQueryInput } from 'querystring';

export interface ApiInterface {
	performGetRequest(endpoint: string, query: ParsedUrlQueryInput | null, token?: string): Promise<any>;
	performPostRequest(endpoint: string, body: any): Promise<any>;
}

export default class Api implements ApiInterface {
	private readonly apiUrl: string;
	private axiosInstance: AxiosInstance;
	private axiosConfig = { headers: { 'Access-Control-Allow-Origin': '*' } };

	constructor(apiUrl: string) {
		this.apiUrl = `${apiUrl}/api`;
		this.axiosInstance = axios.create();
	}

	private resolveAxiosConfig(token?: string): Object | AxiosRequestConfig {
		const defaultConfig = { headers: { Authorization: `Bearer ${token}`, ...this.axiosConfig.headers } };
		if (token) {
			return defaultConfig;
		}
		return {};
	}

	private getEndpoint(endpoint: string, query: ParsedUrlQueryInput | null): string {
		const base = `${this.apiUrl}${endpoint}`;
		if (!query) {
			return base;
		}
		return `${base}?${qs.stringify(query)}`;
	}

	async performGetRequest(endpoint: string, query: ParsedUrlQueryInput | null, token?: string): Promise<any> {
		try {
			return await this.axiosInstance.get(this.getEndpoint(endpoint, query), this.resolveAxiosConfig(token));
		} catch (e) {
			throw e;
		}
	}

	async performPostRequest(endpoint: string, body: any, token?: string): Promise<any> {
		try {
			return await this.axiosInstance.post(`${this.apiUrl}${endpoint}`, body, this.resolveAxiosConfig(token));
		} catch (e) {
			throw e;
		}
	}
}
