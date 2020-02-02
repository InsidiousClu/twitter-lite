type Action = { type: string }
type Handler<State> = {
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
