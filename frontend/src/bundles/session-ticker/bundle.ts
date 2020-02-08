import { createSelector } from 'redux-bundler';

import createReducer from '../create-reducer';
import {
	GET_TICKER_STATE,
	REGISTER_TICKER,
	TICKER_INTERNAL_STATE_CHANGE,
	TICKER_UPDATE,
	UNREGISTER_TICKER
} from './constants';

type State = {
	isSessionActive: boolean;
	isTickerTimerInitialized: boolean;
	scheduledUpdateCount: number;
	tickerRemainingTime: number;
};

const initialState = {
	isSessionActive: false,
	isTickerTimerInitialized: false,
	scheduledUpdateCount: 0,
	tickerRemainingTime: 0
};

const TICKET_START = 'TICKER_START';
const RESET_TICKER = 'RESET_TICKER';
const GET_TICKER_SECONDS = 'GET_TICKER_SECONDS';

const handlers = {
	[REGISTER_TICKER]: state => ({ ...state, isSessionActive: true }),
	[UNREGISTER_TICKER]: state => ({ ...state, isSessionActive: false }),
	[TICKER_UPDATE]: state => ({ ...state, scheduledUpdateCount: state.scheduledUpdateCount + 1 }),
	[GET_TICKER_STATE]: (state, action) => ({
		...state,
		tickerRemainingTime: action.payload * 1000,
		isTickerTimerInitialized: true
	}),
	[TICKER_INTERNAL_STATE_CHANGE]: (state, action) => {
		if (state.tickerRemainingTime > 0) {
			return { ...state, tickerRemainingTime: state.tickerRemainingTime - action.payload };
		}
		return state;
	}
};

export default {
	name: 'sessionTicker',
	reducer: createReducer<State>(initialState, handlers),

	selectSessionTickerRaw: state => state.sessionTicker,
	selectIsSessionActive: createSelector(
		'selectSessionTickerRaw',
		({ isSessionActive }) => isSessionActive
	),
	selectScheduledUpdateCount: createSelector(
		'selectSessionTickerRaw',
		({ scheduledUpdateCount }) => scheduledUpdateCount
	),
	selectTickerRemainingTime: createSelector(
		'selectSessionTickerRaw',
		({ tickerRemainingTime }) => tickerRemainingTime
	),

	doRunUserSessionExpiration: () => ({ wsClient, dispatch }) => {
		dispatch({ type: REGISTER_TICKER });
		wsClient.emit(TICKET_START);
	},
	doSessionClose: () => ({ store: { doUpdateUrl, doUserCleanUp }, dispatch }) => {
		doUserCleanUp();
		dispatch({ type: UNREGISTER_TICKER });
		doUpdateUrl('/auth');
	},
	doSessionUpdate: () => ({
		wsClient,
		dispatch,
		store: { selectIsUserAuthenticated, selectIsSessionActive }
	}) => {
		const isUserAuthenticated = selectIsUserAuthenticated();
		const isSessionActive = selectIsSessionActive();
		if (isUserAuthenticated && isSessionActive) {
			dispatch({ type: TICKER_UPDATE });
			wsClient.emit(RESET_TICKER);
		}
	},
	doGetRemainingSessionTime: () => ({
		wsClient,
		store: { selectIsUserAuthenticated, selectIsSessionActive }
	}) => {
		const isUserAuthenticated = selectIsUserAuthenticated();
		const isSessionActive = selectIsSessionActive();
		if (isUserAuthenticated && isSessionActive) {
			wsClient.emit(GET_TICKER_SECONDS);
		}
	},
	doGetTicketState: payload => ({ type: GET_TICKER_STATE, payload: parseInt(payload) }),
	doChangeInternalTickerState: payload => ({ type: TICKER_INTERNAL_STATE_CHANGE, payload: payload }),

	reactShouldRunExpirationSession: createSelector(
		'selectSessionTickerRaw',
		'selectAuthRaw',
		'selectPathname',
		(ticker, auth, pathname) => {
			if (pathname === '/' && auth.isUserAuthenticated && !ticker.isSessionActive) {
				return { actionCreator: 'doRunUserSessionExpiration' };
			}
			return false;
		}
	),
	reactShouldGetRemainingSessionTime: createSelector(
		'selectSessionTickerRaw',
		'selectAuthRaw',
		'selectPathname',
		(ticker, auth, pathname) => {
			if (
				pathname === '/' &&
				auth.isUserAuthenticated &&
				ticker.isSessionActive &&
				!ticker.isTickerTimerInitialized
			) {
				return { actionCreator: 'doGetRemainingSessionTime' };
			}
			return false;
		}
	)
};
