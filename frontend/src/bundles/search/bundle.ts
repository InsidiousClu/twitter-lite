import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';

import { User } from '../user/bundle';
import { Tweet } from '../tweets/bundle';
import createFetchRequest from '../create-fetch-request';
import { SEARCH_USER, SELECT_SEARCHED_USER } from './constats';

type State = {
	suggestedUsers: Array<User>;
	searchedUser: User & { tweets?: Array<Tweet> };
};

const initialState = {
	suggestedUsers: [],
	searchedUser: {}
};

const handlers = {
	[SEARCH_USER.SUCCESS]: (state, action) => {
		if (action.payload.users) {
			return { ...state, suggestedUsers: action.payload.users };
		}
		return state;
	},
	[SELECT_SEARCHED_USER]: (state, action) => {
		const selectedUser = state.suggestedUsers.find(usr => usr.id === action.payload);
		if (selectedUser) {
			return { ...state, searchedUser: selectedUser };
		}
		return state;
	}
};

export default {
	name: 'search',
	reducer: createReducer<State>(initialState, handlers),
	selectSearch: state => state.search,
	selectSuggestedUsers: createSelector(
		'selectSearch',
		({ suggestedUsers }) => suggestedUsers
	),
	selectSearchedUser: createSelector(
		'selectSearch',
		({ searchedUser }) => searchedUser
	),
	doUserSearch: username =>
		createFetchRequest(SEARCH_USER, {
			method: 'GET',
			endpoint: '/search',
			query: { username }
		}),
	doUserSelect: id => ({ type: SELECT_SEARCHED_USER, payload: id })
};
