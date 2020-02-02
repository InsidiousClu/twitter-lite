import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';

type State = {
	isUserAuthenticated: boolean;
	isUserFetching: boolean;
};

const initialState: State = {
	isUserAuthenticated: false,
	isUserFetching: false
};
const handler = {};

export default {
	name: 'auth',
	reducer: createReducer<State>(initialState, handler),
	selectAuthRaw: state => state.auth,
	selectIsUserAuthenticated: createSelector(
		'selectAuthRaw',
		({ isUserAuthenticated }) => isUserAuthenticated
	),
	selectIsUserFetching: createSelector(
		'selectAuthRaw',
		({ isUserFetching }) => isUserFetching
	),
	reactIsUserAuthenticated: createSelector(
		'selectAuthRaw',
		'selectPathname',
		(authState, pathname) => {
			if (!authState.isUserAuthenticated && !authState.isUserFetching && pathname !== '/auth') {
				return { actionCreator: 'doUpdateUrl', args: ['/auth'] };
			}
			return false;
		}
	)
};
