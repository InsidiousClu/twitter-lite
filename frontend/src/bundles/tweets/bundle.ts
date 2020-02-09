import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';
import createFetchRequest from '../create-fetch-request';
import { GET_MY_TWEETS, FETCH_SINGLE_TWEET, CREATE_NEW_TWEET } from './constants';
import { DateTime } from 'luxon';

export type Tweet = {
	text: string;
	likes: number;
	retweeted: number;
};

type State = {
	myTweets: Array<Tweet>;
	isLoading: boolean;
};

const initialState = {
	myTweets: [],
	isLoading: false
};

const handlers = {
	[GET_MY_TWEETS.START]: state => ({ ...state, isLoading: true }),
	[GET_MY_TWEETS.ERROR]: state => ({ ...state, isLoading: false }),
	[GET_MY_TWEETS.SUCCESS]: (state, action) => ({
		...state,
		myTweets: action.payload.tweets,
		isLoading: false
	}),
	[CREATE_NEW_TWEET.START]: state => ({
		...state,
		myTweets: [{ isLoading: true, id: -1 }, ...state.myTweets]
	}),
	[CREATE_NEW_TWEET.SUCCESS]: (state, action) => ({
		...state,
		myTweets: [action.payload, ...state.myTweets.slice(1)]
	})
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
	selectIsMyTweetsLoading: createSelector(
		'selectTweets',
		({ isLoading }) => isLoading
	),

	doFetchMyTweets: () =>
		createFetchRequest(GET_MY_TWEETS, {
			method: 'GET',
			endpoint: '/me/tweets',
			query: {
				startsAt: DateTime.local()
					.minus({ weeks: 1 })
					.toISO(),
				endsAt: DateTime.local().toISO()
			}
		}),

	doMyTweetSubmit: tweet =>
		createFetchRequest(CREATE_NEW_TWEET, {
			method: 'POST',
			endpoint: '/me/create',
			body: { tweet }
		}),

	reactShouldLoadUserTweets: createSelector(
		'selectAuthRaw',
		'selectCurrentUser',
		'selectPathname',
		'selectMyTweets',
		'selectIsMyTweetsLoading',
		(auth, currentUser, pathname, myTweets, isLoading) => {
			if (
				auth.isUserAuthenticated &&
				pathname === '/' &&
				Object.keys(currentUser).length > 0 &&
				!myTweets.length &&
				!isLoading
			) {
				return { actionCreator: 'doFetchMyTweets' };
			}
			return false;
		}
	)
};
