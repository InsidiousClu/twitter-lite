import { ApiInterface } from '../api/Api';
import { ErrorHandler } from '../common/errors';

type CreateFetchRequestProps = {
	dispatch: ({ type, payload }: { type: string; payload?: any }) => void;
	fetchApi: ApiInterface;
};

export type SuccessHandler = (...args: any) => void;

type Actions = {
	START: string;
	SUCCESS: string;
	ERROR: string;
};

type CreateFetchRequestOptions = {
	endpoint: string;
	method: 'POST' | 'GET' | 'post' | 'get';
	body?: any;
	errorHandler?: ErrorHandler;
	successHandler?: SuccessHandler;
};

const mappedMethods = {
	get: 'performGetRequest',
	post: 'performPostRequest'
};

export const createAPIActions = (baseAction: string): Actions => {
	return <Actions>['START', 'SUCCESS', 'ERROR'].reduce((hash, item) => {
		hash[item] = `${baseAction.toUpperCase()}_${item}`;
		return hash;
	}, {});
};

export default function createFetchRequest(
	actions: Actions,
	{ endpoint, method, body, errorHandler, successHandler }: CreateFetchRequestOptions
) {
	const fetchMethod = mappedMethods[method.toLowerCase()];
	return async ({ dispatch, fetchApi }: CreateFetchRequestProps) => {
		dispatch({ type: actions.START });
		try {
			const result = await fetchApi[fetchMethod](endpoint, body);
			dispatch({ type: actions.SUCCESS, payload: result.data });
			if (successHandler instanceof Function) successHandler(result.data);
		} catch (e) {
			if (errorHandler instanceof Function) errorHandler(e.response.data && e.response.data.message || e.message);
			dispatch({ type: actions.ERROR, payload: e.response.data && e.response.data.message || e.message });
		}
	};
}
