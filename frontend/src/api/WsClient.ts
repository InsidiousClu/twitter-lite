type Broker = (message: string) => void;

interface WsClientInterface {
	handleSocketConnect(broker: Broker): void;
	handleMessageReceive(broker: Broker): void;
	emit(message: string): void;
}

export default class WsClient implements WsClientInterface {
	public client: WebSocket;
	private readonly connectionUrl;

	constructor(connectionUrl: string, broker: Broker) {
		this.connectionUrl = connectionUrl;
		this.client = new WebSocket(this.connectionUrl);
		this.handleMessageReceive(broker);
		this.handleSocketConnect();
	}

	handleSocketConnect(): void {
		this.client.onopen = () => {
			console.log(`Connection with ${this.connectionUrl} established`);
		};
	}

	handleMessageReceive(broker: Broker): void {
		this.client.onmessage = event => {
			broker(event.data);
		};
	}

	emit(message: string): void {
		console.log('MESSAGE:', message);
		this.client.send(message);
	}
}
