import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';
import createFetchRequest, { SuccessHandler } from '../create-fetch-request';
import { USER_LOGIN, USER_REGISTER } from './constants';
import { ErrorHandler } from '../../common/errors';

type AuthParams = {
	email: string;
	password: string;
};

type State = {
	isUserAuthenticated: boolean;
	isUserFetching: boolean;
	currentUser: {
		username?: string;
	};
};

const initialState: State = {
	isUserAuthenticated: false,
	isUserFetching: false,
	currentUser: {}
};

const handler = {
	[USER_REGISTER.SUCCESS]: (state, action) => ({
		...state,
		currentUser: action.payload,
		isUserFetching: false,
		isUserAuthenticated: true
	}),
	[USER_REGISTER.ERROR]: (state, action) => ({ ...state, isUserFetching: false }),

	[USER_LOGIN.SUCCESS]: (state, action) => ({
		...state,
		currentUser: action.payload,
		isUserFetching: false,
		isUserAuthenticated: true
	}),
	[USER_LOGIN.ERROR]: (state, action) => ({ ...state, isUserFetching: false })
};

export default {
	name: 'auth',
	reducer: createReducer<State>(initialState, handler),
	selectAuthRaw: state => state.auth,
	selectIsUserAuthenticated: createSelector(
		'selectAuthRaw',
		({ isUserAuthenticated }: State) => isUserAuthenticated
	),
	selectIsUserFetching: createSelector(
		'selectAuthRaw',
		({ isUserFetching }: State) => isUserFetching
	),
	doUserSignIn: (body: AuthParams, errorHandler: ErrorHandler, successHandler: SuccessHandler) =>
		createFetchRequest(USER_LOGIN, {
			endpoint: '/auth/sign-in',
			method: 'POST',
			body,
			errorHandler,
			successHandler
		}),
	doUserRegister: (body: AuthParams, errorHandler: ErrorHandler, successHandler: SuccessHandler) =>
		createFetchRequest(USER_REGISTER, {
			endpoint: '/auth/register',
			method: 'POST',
			body,
			errorHandler,
			successHandler
		}),

	reactIsUserAuthenticated: createSelector(
		'selectAuthRaw',
		'selectPathname',
		(authState, pathname) => {
			if (!authState.isUserAuthenticated && !authState.isUserFetching && pathname !== '/auth') {
				return { actionCreator: 'doUpdateUrl', args: ['/auth'] };
			}
			return false;
		}
	),
	reactUserRedirect: createSelector(
		'selectAuthRaw',
		'selectPathname',
		(authState, pathname) => {
			if (
				Object.keys(authState.currentUser).length > 1 &&
				authState.currentUser.username &&
				pathname === '/auth'
			) {
				return { actionCreator: 'doUpdateUrl', args: ['/'] };
			}
			return false;
		}
	)
};
