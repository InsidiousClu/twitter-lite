import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';
import createFetchRequest from '../create-fetch-request';
import { GET_MY_TWEETS } from './constants';
import { User } from '../user/bundle';

type Tweet = {
	text: string;
	likes: number;
	retweeted: number;
};

type State = {
	myTweets: Array<Tweet>;
	searchedUser: User & { tweets?: Array<Tweet> };
};

const initialState = {
	myTweets: [],
	searchedUser: {}
};

const handlers = {
	[GET_MY_TWEETS.SUCCESS]: (state, action) => {
		return ({ ...state, myTweets: action.payload })
	},
	[GET_MY_TWEETS.ERROR]: state => {
		debugger;
		return state;
	}
};

export default {
	name: 'tweets',
	reducer: createReducer<State>(initialState, handlers),
	selectTweets: state => state.tweets,
	selectMyTweets: createSelector(
		'selectTweets',
		({ myTweets }) => myTweets
	),
	selectSearchedUser: createSelector(
		'selectTweets',
		({ searchedUser }) => searchedUser
	),
	doUserSearch: () => {},

	doFetchMyTweets: () => createFetchRequest(GET_MY_TWEETS, {
		method: 'GET',
		endpoint: '/me/tweets'
	}),

	reactShouldLoadUserTweets: createSelector(
		'selectAuthRaw',
		'selectCurrentUser',
		'selectPathname',
		'selectMyTweets',
		(auth, currentUser, pathname, myTweets) => {
			if (
				auth.isUserAuthenticated &&
				pathname === '/' &&
				Object.keys(currentUser).length > 0 &&
				!myTweets.length
			) {
				return { actionCreator: 'doFetchMyTweets' };
			}
			return false;
		}
	)
};
