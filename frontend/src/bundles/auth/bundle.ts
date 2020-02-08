import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';
import createFetchRequest, { SuccessHandler } from '../create-fetch-request';
import { USER_CLEANUP, USER_LOGIN, USER_REGISTER } from './constants';
import { ErrorHandler } from '../../common/errors';

type AuthParams = {
	email: string;
	password: string;
};

type State = {
	isUserAuthenticated: boolean;
	isUserFetching: boolean;
};

const initialState: State = {
	isUserAuthenticated: false,
	isUserFetching: false
};

const handler = {
	[USER_REGISTER.SUCCESS]: state => ({
		...state,
		isUserFetching: false,
		isUserAuthenticated: true
	}),
	[USER_REGISTER.ERROR]: state => ({ ...state, isUserFetching: false }),

	[USER_LOGIN.SUCCESS]: state => ({
		...state,
		isUserFetching: false,
		isUserAuthenticated: true
	}),
	[USER_LOGIN.ERROR]: state => ({ ...state, isUserFetching: false }),
	[USER_CLEANUP]: () => initialState
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
			endpoint: '/auth/login',
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
	doUserCleanUp: () => ({ type: USER_CLEANUP }),

	reactUserRedirect: createSelector(
		'selectAuthRaw',
		'selectUserRaw',
		'selectPathname',
		(authState, user, pathname) => {
			if (Object.keys(user.currentUser).length > 1 && user.currentUser.username && pathname === '/auth') {
				return { actionCreator: 'doUpdateUrl', args: ['/'] };
			}
			return false;
		}
	)
};
