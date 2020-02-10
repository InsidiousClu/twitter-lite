import { createSelector } from 'redux-bundler';
import createReducer from '../create-reducer';
import createFetchRequest from '../create-fetch-request';
import { GET_MY_TWEETS, TWEETS_EMPTY, CREATE_NEW_TWEET } from './constants';
import { DateTime } from 'luxon';

export type Tweet = {
	text: string;
	likes: number;
	retweeted: number;
};

type State = {
	myTweets: Array<Tweet>;
	isLoading: boolean;
	tweetsAreEmpty: boolean;
};

const initialState = {
	myTweets: [],
	isLoading: false,
	tweetsAreEmpty: false
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
	}),
	[TWEETS_EMPTY]: state => ({ ...state, tweetsAreEmpty: true })
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
	selectTweetsAreEmpty: createSelector(
		'selectTweets',
		({ tweetsAreEmpty }) => tweetsAreEmpty
	),

	doFetchMyTweets: () => ({ fetchApi, dispatch, store: { selectCurrentUser } }) =>
		createFetchRequest(GET_MY_TWEETS, {
			method: 'GET',
			endpoint: '/me/tweets',
			successHandler: ({ tweets }) => {
				if (!tweets.length) {
					dispatch({ type: TWEETS_EMPTY });
				}
			},
			query: {
				startsAt: DateTime.local()
					.minus({ weeks: 1 })
					.toISO(),
				endsAt: DateTime.local().toISO()
			}
		})({ fetchApi, dispatch, store: { selectCurrentUser } }),

	doMyTweetSubmit: tweet => ({ fetchApi, dispatch, store: { selectCurrentUser, doSessionUpdate } }) => {
		createFetchRequest(CREATE_NEW_TWEET, {
			method: 'POST',
			endpoint: '/me/create',
			body: { tweet },
			successHandler: () => doSessionUpdate()
		})({ fetchApi, dispatch, store: { selectCurrentUser } });
	},

	reactShouldLoadUserTweets: createSelector(
		'selectAuthRaw',
		'selectCurrentUser',
		'selectPathname',
		'selectMyTweets',
		'selectIsMyTweetsLoading',
		'selectTweetsAreEmpty',
		(auth, currentUser, pathname, myTweets, isLoading, tweetsAreEmpty) => {
			if (
				auth.isUserAuthenticated &&
				pathname === '/' &&
				Object.keys(currentUser).length > 0 &&
				!myTweets.length &&
				!isLoading &&
				!tweetsAreEmpty
			) {
				return { actionCreator: 'doFetchMyTweets' };
			}
			return false;
		}
	)
};
