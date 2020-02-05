type Action = { type: string, payload?: any }
export type Handler<State> = {
	[key: string]: (state: State, action: Action) => State
}

export default function createReducer<State>(initialState: State, handler: Handler<State>) {
	return (state = initialState, action: Action) => {
		if (handler[action.type]) {
			return handler[action.type](state, action);
		}
		return state;
	};
}
