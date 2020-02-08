import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';
import { USER_LOGIN, USER_REGISTER } from '../auth/constants';

export type User = {
	id?: number;
	username?: string;
	email?: string;
	auth_token?: string;
};

type State = {
	currentUser: User;
};

const initialState = {
	currentUser: {}
};

const handlers = {
	[USER_REGISTER.SUCCESS]: (state, action) => ({ ...state, currentUser: action.payload }),
	[USER_LOGIN.SUCCESS]: (state, action) => ({ ...state, currentUser: action.payload })
};

export default {
	name: 'user',
	reducer: createReducer<State>(initialState, handlers),
	selectUserRaw: state => state.user,
	selectCurrentUser: createSelector(
		'selectUserRaw',
		({ currentUser }) => currentUser
	),
	selectUserToken: createSelector(
		'selectUserRaw',
		({ auth_token }) => auth_token
	)
};
