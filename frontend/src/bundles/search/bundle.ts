import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';

import { User } from '../user/bundle';
import { Tweet } from '../tweets/bundle';
import createFetchRequest from '../create-fetch-request';
import { SEARCH_USER } from './constats';

type State = {
	suggestedUsers: Array<User>;
	searchedUser: User & { tweets?: Array<Tweet> };
};

const initialState = {
	suggestedUsers: [],
	searchedUser: {}
};

const handlers = {};

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
};
