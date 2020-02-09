import { ApiInterface } from '../api/Api';
import { ErrorHandler } from '../common/errors';
import { User } from './user/bundle';

type CreateFetchRequestProps = {
	dispatch: ({ type, payload }: { type: string; payload?: any }) => void;
	fetchApi: ApiInterface;
	store: {
		selectCurrentUser: () => User;
	};
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
	query?: Object
};

const mappedMethods = {
	get: 'performGetRequest',
	post: 'performPostRequest'
};

export const createAPIActions = (baseAction: string): Actions => {
	return ['START', 'SUCCESS', 'ERROR'].reduce((hash, item) => {
		hash[item] = `${baseAction.toUpperCase()}_${item}`;
		return hash;
	}, {}) as Actions;
};

export default function createFetchRequest(
	actions: Actions,
	{ endpoint, method, body, errorHandler, successHandler, query }: CreateFetchRequestOptions
) {
	const fetchMethod = mappedMethods[method.toLowerCase()];
	return async ({ dispatch, fetchApi, store: { selectCurrentUser } }: CreateFetchRequestProps) => {
		dispatch({ type: actions.START });
		const user = selectCurrentUser();
		try {
			const result = await fetchApi[fetchMethod](endpoint, body || query, user.auth_token, query);
			dispatch({ type: actions.SUCCESS, payload: result.data });
			if (successHandler instanceof Function) successHandler(result.data);
		} catch (e) {
			if (errorHandler instanceof Function)
				errorHandler(e.response && e.response.data ? e.response.data.message : e.message);
			dispatch({
				type: actions.ERROR,
				payload: e.response && e.response.data ? e.response.data.message : e.message
			});
		}
	};
}
