import Api from '../api/Api';
import WsClient from '../api/WsClient';

export default {
	name: 'extra-args',
	getExtraArgs: store => {
		return {
			fetchApi: new Api(process.env.API_URL || 'http://localhost:8082'),
			wsClient: new WsClient(process.env.WS_URL || 'ws://localhost:8082/ws', message => {
				store.doHandleWSMessage(message);
			})
		};
	}
};
