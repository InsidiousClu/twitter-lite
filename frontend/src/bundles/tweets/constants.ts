import { createAPIActions } from '../create-fetch-request';

export const GET_MY_TWEETS = createAPIActions('GET_MY_TWEETS');
export const FETCH_SINGLE_TWEET = createAPIActions('FETCH_SINGLE_TWEET');
export const CREATE_NEW_TWEET = createAPIActions('CREATE_NEW_TWEET');
export const UPDATE_TWEET = 'UPDATE_TWEET';