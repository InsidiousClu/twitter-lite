import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';
import { USER_LOGIN, USER_REGISTER } from '../auth/constants';

type State = {
	currentUser: {
		username?: string;
		email?: string;
	};
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
	selectCurrentUser: createSelector('selectUserRaw', ({ currentUser }) => currentUser),
};
