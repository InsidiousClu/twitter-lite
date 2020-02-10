import { createAPIActions } from '../create-fetch-request';

export const GET_MY_TWEETS = createAPIActions('GET_MY_TWEETS');
export const CREATE_NEW_TWEET = createAPIActions('CREATE_NEW_TWEET');
export const TWEETS_EMPTY = 'TWEETS_EMPTY';
export const UPDATE_TWEET = 'UPDATE_TWEET';