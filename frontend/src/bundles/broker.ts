const WS_MESSAGE_RECEIVED = 'WS_MESSAGE_RECEIVED';

const SESSION_TERMINATION_ACTIVATED = 'SESSION_TERMINATION_ACTIVATED';
const SESSION_CLOSE = 'SESSION_CLOSE';
const GET_TICKER_SECONDS = 'GET_TICKER_SECONDS';


const WS_MESSAGES = [SESSION_TERMINATION_ACTIVATED, SESSION_CLOSE, GET_TICKER_SECONDS];

const HANDLERS = {
	SESSION_CLOSE: 'doSessionClose',
	GET_TICKER_SECONDS: 'doGetTicketState'
};

export default {
	name: 'messageBroker',
	doHandleWSMessage: data => ({ store }) => {
		const message = JSON.parse(data);
		const currentAction = WS_MESSAGES.find(item => item === message.type);
		if (currentAction) {
			const action = HANDLERS[message.type];
			if (action) {
				if(store[action] instanceof Function) {
					return store[action](message.payload);
				}
				return ({ type: message.type, payload: message.payload })
			}
			return { type: currentAction, payload: message.payload };
		}
		return { type: WS_MESSAGE_RECEIVED, payload: message.payload };
	}
};
